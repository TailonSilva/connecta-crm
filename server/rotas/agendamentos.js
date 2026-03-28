const express = require('express');
const { banco, consultarTodos, consultarUm, executar } = require('../configuracoes/banco');

const rotaAgendamentos = express.Router();

rotaAgendamentos.get('/', async (_requisicao, resposta) => {
  try {
    const registros = await consultarTodos(`
      SELECT
        agendamento.*,
        (
          SELECT GROUP_CONCAT(agendamentoRecurso.idRecurso)
          FROM agendamentoRecurso
          WHERE agendamentoRecurso.idAgendamento = agendamento.idAgendamento
        ) AS idsRecursos,
        (
          SELECT GROUP_CONCAT(agendamentoUsuario.idUsuario)
          FROM agendamentoUsuario
          WHERE agendamentoUsuario.idAgendamento = agendamento.idAgendamento
        ) AS idsUsuarios
      FROM agendamento
      ORDER BY agendamento.idAgendamento DESC
    `);

    resposta.json(registros.map(normalizarAgendamentoRetornado));
  } catch (_erro) {
    resposta.status(500).json({ mensagem: 'Ocorreu um erro ao processar a requisicao.' });
  }
});

rotaAgendamentos.get('/:id', async (requisicao, resposta) => {
  try {
    const registro = await consultarUm(`
      SELECT
        agendamento.*,
        (
          SELECT GROUP_CONCAT(agendamentoRecurso.idRecurso)
          FROM agendamentoRecurso
          WHERE agendamentoRecurso.idAgendamento = agendamento.idAgendamento
        ) AS idsRecursos,
        (
          SELECT GROUP_CONCAT(agendamentoUsuario.idUsuario)
          FROM agendamentoUsuario
          WHERE agendamentoUsuario.idAgendamento = agendamento.idAgendamento
        ) AS idsUsuarios
      FROM agendamento
      WHERE agendamento.idAgendamento = ?
    `, [requisicao.params.id]);

    if (!registro) {
      resposta.status(404).json({ mensagem: 'Registro nao encontrado.' });
      return;
    }

    resposta.json(normalizarAgendamentoRetornado(registro));
  } catch (_erro) {
    resposta.status(500).json({ mensagem: 'Ocorreu um erro ao processar a requisicao.' });
  }
});

rotaAgendamentos.post('/', async (requisicao, resposta) => {
  try {
    const payload = normalizarPayloadAgendamento(requisicao.body);
    const tipoAgenda = await obterTipoAgenda(payload.idTipoAgenda);
    const camposFaltantes = validarCamposObrigatorios(payload, tipoAgenda);

    if (camposFaltantes.length > 0) {
      resposta.status(400).json({
        mensagem: `Campos obrigatorios nao informados: ${camposFaltantes.join(', ')}.`
      });
      return;
    }

    const resultado = await executar(
      `INSERT INTO agendamento (
        data,
        assunto,
        horaInicio,
        horaFim,
        idLocal,
        idRecurso,
        idCliente,
        idContato,
        idUsuario,
        tipo,
        idTipoAgenda,
        idStatusVisita,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.data,
        payload.assunto,
        payload.horaInicio,
        payload.horaFim,
        payload.idLocal,
        payload.idRecurso,
        payload.idCliente,
        payload.idContato,
        payload.idUsuario,
        payload.tipo,
        payload.idTipoAgenda,
        payload.idStatusVisita,
        payload.status
      ]
    );

    await salvarRecursosAgendamento(resultado.id, payload.idsRecursos);
    await salvarUsuariosAgendamento(resultado.id, payload.idsUsuarios);

    const registro = await consultarUm(`
      SELECT
        agendamento.*,
        (
          SELECT GROUP_CONCAT(agendamentoRecurso.idRecurso)
          FROM agendamentoRecurso
          WHERE agendamentoRecurso.idAgendamento = agendamento.idAgendamento
        ) AS idsRecursos,
        (
          SELECT GROUP_CONCAT(agendamentoUsuario.idUsuario)
          FROM agendamentoUsuario
          WHERE agendamentoUsuario.idAgendamento = agendamento.idAgendamento
        ) AS idsUsuarios
      FROM agendamento
      WHERE agendamento.idAgendamento = ?
    `, [resultado.id]);

    resposta.status(201).json(normalizarAgendamentoRetornado(registro));
  } catch (_erro) {
    resposta.status(500).json({ mensagem: 'Nao foi possivel concluir a operacao por violacao de integridade dos dados.' });
  }
});

rotaAgendamentos.put('/:id', async (requisicao, resposta) => {
  try {
    const registroExistente = await consultarUm(
      'SELECT * FROM agendamento WHERE idAgendamento = ?',
      [requisicao.params.id]
    );

    if (!registroExistente) {
      resposta.status(404).json({ mensagem: 'Registro nao encontrado.' });
      return;
    }

    const payload = normalizarPayloadAgendamento({
      ...registroExistente,
      ...requisicao.body
    });
    const tipoAgenda = await obterTipoAgenda(payload.idTipoAgenda);
    const camposFaltantes = validarCamposObrigatorios(payload, tipoAgenda);

    if (camposFaltantes.length > 0) {
      resposta.status(400).json({
        mensagem: `Campos obrigatorios nao informados: ${camposFaltantes.join(', ')}.`
      });
      return;
    }

    await executar(
      `UPDATE agendamento SET
        data = ?,
        assunto = ?,
        horaInicio = ?,
        horaFim = ?,
        idLocal = ?,
        idRecurso = ?,
        idCliente = ?,
        idContato = ?,
        idUsuario = ?,
        tipo = ?,
        idTipoAgenda = ?,
        idStatusVisita = ?,
        status = ?
      WHERE idAgendamento = ?`,
      [
        payload.data,
        payload.assunto,
        payload.horaInicio,
        payload.horaFim,
        payload.idLocal,
        payload.idRecurso,
        payload.idCliente,
        payload.idContato,
        payload.idUsuario,
        payload.tipo,
        payload.idTipoAgenda,
        payload.idStatusVisita,
        payload.status,
        Number(requisicao.params.id)
      ]
    );

    await executar(
      'DELETE FROM agendamentoRecurso WHERE idAgendamento = ?',
      [Number(requisicao.params.id)]
    );
    await executar(
      'DELETE FROM agendamentoUsuario WHERE idAgendamento = ?',
      [Number(requisicao.params.id)]
    );
    await salvarRecursosAgendamento(Number(requisicao.params.id), payload.idsRecursos);
    await salvarUsuariosAgendamento(Number(requisicao.params.id), payload.idsUsuarios);

    const registro = await consultarUm(`
      SELECT
        agendamento.*,
        (
          SELECT GROUP_CONCAT(agendamentoRecurso.idRecurso)
          FROM agendamentoRecurso
          WHERE agendamentoRecurso.idAgendamento = agendamento.idAgendamento
        ) AS idsRecursos,
        (
          SELECT GROUP_CONCAT(agendamentoUsuario.idUsuario)
          FROM agendamentoUsuario
          WHERE agendamentoUsuario.idAgendamento = agendamento.idAgendamento
        ) AS idsUsuarios
      FROM agendamento
      WHERE agendamento.idAgendamento = ?
    `, [Number(requisicao.params.id)]);

    resposta.json(normalizarAgendamentoRetornado(registro));
  } catch (_erro) {
    resposta.status(500).json({ mensagem: 'Nao foi possivel concluir a operacao por violacao de integridade dos dados.' });
  }
});

rotaAgendamentos.delete('/:id', async (requisicao, resposta) => {
  try {
    const registroExistente = await consultarUm(
      'SELECT * FROM agendamento WHERE idAgendamento = ?',
      [requisicao.params.id]
    );

    if (!registroExistente) {
      resposta.status(404).json({ mensagem: 'Registro nao encontrado.' });
      return;
    }

    await executar(
      'DELETE FROM agendamentoRecurso WHERE idAgendamento = ?',
      [Number(requisicao.params.id)]
    );
    await executar(
      'DELETE FROM agendamentoUsuario WHERE idAgendamento = ?',
      [Number(requisicao.params.id)]
    );
    await executar(
      'DELETE FROM agendamento WHERE idAgendamento = ?',
      [Number(requisicao.params.id)]
    );

    resposta.status(204).send();
  } catch (_erro) {
    resposta.status(500).json({ mensagem: 'Ocorreu um erro ao processar a requisicao.' });
  }
});

async function salvarRecursosAgendamento(idAgendamento, idsRecursos) {
  for (const idRecurso of idsRecursos) {
    await executar(
      'INSERT INTO agendamentoRecurso (idAgendamento, idRecurso) VALUES (?, ?)',
      [idAgendamento, idRecurso]
    );
  }
}

async function salvarUsuariosAgendamento(idAgendamento, idsUsuarios) {
  for (const idUsuario of idsUsuarios) {
    await executar(
      'INSERT INTO agendamentoUsuario (idAgendamento, idUsuario) VALUES (?, ?)',
      [idAgendamento, idUsuario]
    );
  }
}

function normalizarPayloadAgendamento(payload) {
  const idsRecursosNormalizados = normalizarIdsRecursos(payload.idsRecursos, payload.idRecurso);
  const idsUsuariosNormalizados = normalizarIdsUsuarios(payload.idsUsuarios, payload.idUsuario);

  return {
    data: payload.data,
    assunto: payload.assunto ? String(payload.assunto).trim() : null,
    horaInicio: payload.horaInicio,
    horaFim: payload.horaFim,
    idLocal: payload.idLocal ? Number(payload.idLocal) : null,
    idRecurso: idsRecursosNormalizados[0] || (payload.idRecurso ? Number(payload.idRecurso) : null),
    idCliente: payload.idCliente ? Number(payload.idCliente) : null,
    idContato: payload.idContato ? Number(payload.idContato) : null,
    idUsuario: idsUsuariosNormalizados[0] || (payload.idUsuario ? Number(payload.idUsuario) : null),
    tipo: payload.tipo || null,
    idTipoAgenda: Number(payload.idTipoAgenda),
    idStatusVisita: Number(payload.idStatusVisita),
    status: payload.status === undefined ? 1 : Number(payload.status),
    idsRecursos: idsRecursosNormalizados,
    idsUsuarios: idsUsuariosNormalizados
  };
}

function normalizarIdsRecursos(idsRecursos, idRecurso) {
  if (Array.isArray(idsRecursos)) {
    return idsRecursos
      .map((valor) => Number(valor))
      .filter((valor, indice, lista) => Number.isInteger(valor) && valor > 0 && lista.indexOf(valor) === indice);
  }

  if (typeof idsRecursos === 'string' && idsRecursos.trim()) {
    return idsRecursos
      .split(',')
      .map((valor) => Number(valor.trim()))
      .filter((valor, indice, lista) => Number.isInteger(valor) && valor > 0 && lista.indexOf(valor) === indice);
  }

  const idUnico = Number(idRecurso);
  return Number.isInteger(idUnico) && idUnico > 0 ? [idUnico] : [];
}

function normalizarIdsUsuarios(idsUsuarios, idUsuario) {
  if (Array.isArray(idsUsuarios)) {
    return idsUsuarios
      .map((valor) => Number(valor))
      .filter((valor, indice, lista) => Number.isInteger(valor) && valor > 0 && lista.indexOf(valor) === indice);
  }

  if (typeof idsUsuarios === 'string' && idsUsuarios.trim()) {
    return idsUsuarios
      .split(',')
      .map((valor) => Number(valor.trim()))
      .filter((valor, indice, lista) => Number.isInteger(valor) && valor > 0 && lista.indexOf(valor) === indice);
  }

  const idUnico = Number(idUsuario);
  return Number.isInteger(idUnico) && idUnico > 0 ? [idUnico] : [];
}

async function obterTipoAgenda(idTipoAgenda) {
  if (!idTipoAgenda) {
    return null;
  }

  return consultarUm(
    'SELECT * FROM tipoAgenda WHERE idTipoAgenda = ?',
    [Number(idTipoAgenda)]
  );
}

function validarCamposObrigatorios(payload, tipoAgenda) {
  const campos = [
    ['data', payload.data],
    ['assunto', payload.assunto],
    ['horaInicio', payload.horaInicio],
    ['horaFim', payload.horaFim],
    ['idUsuario', payload.idUsuario],
    ['idTipoAgenda', payload.idTipoAgenda],
    ['idStatusVisita', payload.idStatusVisita]
  ];

  if (tipoAgenda?.obrigarCliente) {
    campos.push(['idCliente', payload.idCliente]);
    campos.push(['idContato', payload.idContato]);
  }

  if (payload.idCliente) {
    campos.push(['idContato', payload.idContato]);
  }

  if (tipoAgenda?.obrigarLocal) {
    campos.push(['idLocal', payload.idLocal]);
  }

  if (tipoAgenda?.obrigarRecurso) {
    campos.push(['idRecurso', payload.idRecurso]);
  }

  return campos
    .filter(([, valor]) => !valor)
    .map(([campo]) => campo);
}

function normalizarAgendamentoRetornado(registro) {
  if (!registro) {
    return null;
  }

  const idsRecursos = normalizarIdsRecursos(registro.idsRecursos, registro.idRecurso);
  const idsUsuarios = normalizarIdsUsuarios(registro.idsUsuarios, registro.idUsuario);

  return {
    ...registro,
    idsRecursos,
    idsUsuarios
  };
}

module.exports = {
  rotaAgendamentos
};
