const { consultarTodos, consultarUm, executar } = require('../configuracoes/banco');

async function sincronizarGrupoEmpresaDoCliente(idCliente, idGrupoEmpresa) {
  if (!idCliente) {
    return;
  }

  await removerContatosHerdadosDoCliente(idCliente);

  if (!idGrupoEmpresa) {
    return;
  }

   const grupoEmpresa = await consultarUm(
    `SELECT idGrupoEmpresa
     FROM grupoEmpresa
     WHERE idGrupoEmpresa = ? AND status = 1`,
    [idGrupoEmpresa]
  );

  if (!grupoEmpresa) {
    return;
  }

  const contatosGrupo = await consultarTodos(
    `SELECT  *
     FROM contatoGrupoEmpresa
     WHERE idGrupoEmpresa = ?`,
    [idGrupoEmpresa]
  );

  for (const contatoGrupo of contatosGrupo) {
    await sincronizarContatoGrupoParaCliente(idCliente, contatoGrupo);
  }
}

async function sincronizarContatoGrupoParaClientesVinculados(idContatoGrupoEmpresa) {
  if (!idContatoGrupoEmpresa) {
    return;
  }

  const contatoGrupo = await consultarUm(
    `SELECT *
     FROM contatoGrupoEmpresa
     WHERE idContatoGrupoEmpresa = ?`,
    [idContatoGrupoEmpresa]
  );

  if (!contatoGrupo) {
    return;
  }

  const clientes = await consultarTodos(
    `SELECT idCliente
     FROM cliente
     WHERE idGrupoEmpresa = ?`,
    [contatoGrupo.idGrupoEmpresa]
  );

  for (const cliente of clientes) {
    await sincronizarContatoGrupoParaCliente(cliente.idCliente, contatoGrupo);
  }
}

async function sincronizarGrupoEmpresaParaClientesVinculados(idGrupoEmpresa) {
  if (!idGrupoEmpresa) {
    return;
  }

  const clientes = await consultarTodos(
    `SELECT idCliente
     FROM cliente
     WHERE idGrupoEmpresa = ?`,
    [idGrupoEmpresa]
  );

  for (const cliente of clientes) {
    await sincronizarGrupoEmpresaDoCliente(cliente.idCliente, idGrupoEmpresa);
  }
}

async function sincronizarContatoGrupoParaCliente(idCliente, contatoGrupo) {
  const existente = await consultarUm(
    `SELECT idContato
     FROM contato
     WHERE idCliente = ? AND idContatoGrupoEmpresaOrigem = ?`,
    [idCliente, contatoGrupo.idContatoGrupoEmpresa]
  );

  const payload = [
    contatoGrupo.nome,
    contatoGrupo.cargo || null,
    contatoGrupo.email || null,
    contatoGrupo.telefone || null,
    contatoGrupo.whatsapp || null,
    contatoGrupo.status ? 1 : 0,
    contatoGrupo.principal ? 1 : 0,
    1,
    contatoGrupo.idContatoGrupoEmpresa,
    idCliente
  ];

  if (existente?.idContato) {
    await executar(
      `UPDATE contato
       SET nome = ?,
           cargo = ?,
           email = ?,
           telefone = ?,
           whatsapp = ?,
           status = ?,
           principal = ?,
           contatoVinculadoGrupo = ?,
           idContatoGrupoEmpresaOrigem = ?
       WHERE idContato = ?`,
      [...payload.slice(0, 9), existente.idContato]
    );
    return;
  }

  await executar(
    `INSERT INTO contato (
      idCliente,
      nome,
      cargo,
      email,
      telefone,
      whatsapp,
      status,
      principal,
      contatoVinculadoGrupo,
      idContatoGrupoEmpresaOrigem
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      idCliente,
      contatoGrupo.nome,
      contatoGrupo.cargo || null,
      contatoGrupo.email || null,
      contatoGrupo.telefone || null,
      contatoGrupo.whatsapp || null,
      contatoGrupo.status ? 1 : 0,
      contatoGrupo.principal ? 1 : 0,
      1,
      contatoGrupo.idContatoGrupoEmpresa
    ]
  );
}

async function removerContatosHerdadosDoCliente(idCliente) {
  await executar(
    `UPDATE contato
     SET status = 0,
         principal = 0
     WHERE idCliente = ? AND contatoVinculadoGrupo = 1`,
    [idCliente]
  );
}

module.exports = {
  sincronizarGrupoEmpresaDoCliente,
  sincronizarGrupoEmpresaParaClientesVinculados,
  sincronizarContatoGrupoParaClientesVinculados,
  removerContatosHerdadosDoCliente
};
