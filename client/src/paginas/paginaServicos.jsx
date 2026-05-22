import { useEffect, useMemo, useState } from 'react';
import { CorpoPagina } from '../componentes/layout/corpoPagina';
import { CabecalhoServicos } from '../componentes/modulos/servicos-cabecalhoServicos';
import { ListaServicos } from '../componentes/modulos/servicos-listaServicos';
import { ModalEdicaoServicosCliente } from '../componentes/modulos/servicos-modalEdicaoCliente';
import { ModalFiltrosServicos } from '../componentes/modulos/servicos-modalFiltrosServicos';
import {
  atualizarClienteServico,
  incluirClienteServico,
  listarClientes,
  listarClientesServicos,
  listarConceitosCliente,
  listarGruposEmpresa,
  listarVendedores
} from '../servicos/clientes';
import { listarEmpresas } from '../servicos/empresa';
import { listarServicos } from '../servicos/servicos';
import { useFiltrosPersistidos } from '../hooks/useFiltrosPersistidos';
import { obterCodigoPrincipalCliente } from '../utilitarios/codigoCliente';
import '../recursos/estilos/paginaServicos.css';

const filtrosIniciaisServicos = {
  idVendedor: [],
  idConceito: [],
  idGrupoEmpresa: [],
  status: [],
  estado: [],
  servicos: []
};

export function PaginaServicos({ usuarioLogado }) {
  const [pesquisa, definirPesquisa] = useState('');
  const [modalFiltrosAberto, definirModalFiltrosAberto] = useState(false);
  const [filtros, definirFiltros] = useFiltrosPersistidos({
    chave: 'servicos',
    usuario: usuarioLogado,
    filtrosPadrao: filtrosIniciaisServicos,
    normalizarFiltros: normalizarFiltrosServicos
  });
  const [clientes, definirClientes] = useState([]);
  const [servicos, definirServicos] = useState([]);
  const [clientesServicos, definirClientesServicos] = useState([]);
  const [gruposEmpresa, definirGruposEmpresa] = useState([]);
  const [conceitosCliente, definirConceitosCliente] = useState([]);
  const [vendedores, definirVendedores] = useState([]);
  const [empresa, definirEmpresa] = useState(null);
  const [carregando, definirCarregando] = useState(true);
  const [mensagemErro, definirMensagemErro] = useState('');
  const [clienteEmEdicao, definirClienteEmEdicao] = useState(null);
  const [formularioServicosCliente, definirFormularioServicosCliente] = useState([]);
  const [salvandoServicosCliente, definirSalvandoServicosCliente] = useState(false);
  const [mensagemErroModal, definirMensagemErroModal] = useState('');

  useEffect(() => {
    carregarServicosClientes();
  }, []);

  const servicosOrdenados = useMemo(
    () => ordenarServicos(servicos),
    [servicos]
  );

  const linhas = useMemo(
    () => filtrarLinhasServicosCliente(
      montarLinhasServicosCliente(clientes, clientesServicos, gruposEmpresa, conceitosCliente, empresa),
      servicosOrdenados,
      pesquisa,
      filtros
    ),
    [clientes, clientesServicos, gruposEmpresa, conceitosCliente, empresa, pesquisa, servicosOrdenados, filtros]
  );

  const filtrosAtivos = useMemo(
    () => filtrosServicosEstaoAtivos(filtros),
    [filtros]
  );

  const estadosClientes = useMemo(
    () => obterEstadosClientes(clientes),
    [clientes]
  );

  async function carregarServicosClientes() {
    definirCarregando(true);
    definirMensagemErro('');

    try {
      const resultados = await Promise.allSettled([
        listarClientes(),
        listarServicos({ incluirInativos: true }),
        listarClientesServicos(),
        listarGruposEmpresa({ incluirInativos: true }),
        listarConceitosCliente({ incluirInativos: true }),
        listarVendedores({ incluirInativos: true }),
        listarEmpresas()
      ]);

      const [
        clientesResultado,
        servicosResultado,
        clientesServicosResultado,
        gruposEmpresaResultado,
        conceitosClienteResultado,
        vendedoresResultado,
        empresasResultado
      ] = resultados;

      definirClientes(clientesResultado.status === 'fulfilled' ? clientesResultado.value : []);
      definirServicos(servicosResultado.status === 'fulfilled' ? servicosResultado.value : []);
      definirClientesServicos(clientesServicosResultado.status === 'fulfilled' ? clientesServicosResultado.value : []);
      definirGruposEmpresa(gruposEmpresaResultado.status === 'fulfilled' ? gruposEmpresaResultado.value : []);
      definirConceitosCliente(conceitosClienteResultado.status === 'fulfilled' ? conceitosClienteResultado.value : []);
      definirVendedores(vendedoresResultado.status === 'fulfilled' ? vendedoresResultado.value : []);
      definirEmpresa(empresasResultado.status === 'fulfilled' ? (empresasResultado.value[0] || null) : null);
    } catch (_erro) {
      definirMensagemErro('Nao foi possivel carregar os servicos por cliente.');
      definirClientes([]);
      definirServicos([]);
      definirClientesServicos([]);
      definirGruposEmpresa([]);
      definirConceitosCliente([]);
      definirVendedores([]);
      definirEmpresa(null);
    } finally {
      definirCarregando(false);
    }
  }

  function abrirEdicaoServicosCliente(linha) {
    definirClienteEmEdicao(linha);
    definirFormularioServicosCliente(criarFormularioServicosCliente(linha, servicosOrdenados));
    definirMensagemErroModal('');
  }

  function fecharEdicaoServicosCliente() {
    if (salvandoServicosCliente) {
      return;
    }

    definirClienteEmEdicao(null);
    definirFormularioServicosCliente([]);
    definirMensagemErroModal('');
  }

  function alterarServicoClienteFormulario(idServico, campo, valor) {
    definirFormularioServicosCliente((estadoAtual) => estadoAtual.map((servicoCliente) => (
      String(servicoCliente.idServico) === String(idServico)
        ? { ...servicoCliente, [campo]: valor }
        : servicoCliente
    )));
  }

  async function salvarServicosCliente() {
    if (!clienteEmEdicao?.idCliente) {
      return;
    }

    definirSalvandoServicosCliente(true);
    definirMensagemErroModal('');

    try {
      for (const servicoCliente of formularioServicosCliente) {
        const observacao = String(servicoCliente.observacao || '').trim();
        const situacao = obterSituacaoServicoCliente(servicoCliente);
        const contratado = situacao === 'contratado' ? 1 : 0;

        if (!servicoCliente.idClienteServico && situacao === 'naoContratado' && !observacao) {
          continue;
        }

        const payload = {
          idCliente: Number(clienteEmEdicao.idCliente),
          idServico: Number(servicoCliente.idServico),
          contratado,
          situacao,
          observacao
        };

        if (servicoCliente.idClienteServico) {
          await atualizarClienteServico(servicoCliente.idClienteServico, payload);
        } else {
          await incluirClienteServico(payload);
        }
      }

      await carregarServicosClientes();
      definirClienteEmEdicao(null);
      definirFormularioServicosCliente([]);
      definirMensagemErroModal('');
    } catch (_erro) {
      definirMensagemErroModal('Nao foi possivel salvar os servicos do cliente.');
    } finally {
      definirSalvandoServicosCliente(false);
    }
  }

  return (
    <>
      <CabecalhoServicos
        pesquisa={pesquisa}
        aoAlterarPesquisa={definirPesquisa}
        aoAbrirFiltros={() => definirModalFiltrosAberto(true)}
        filtrosAtivos={filtrosAtivos}
      />

      <CorpoPagina>
        <ListaServicos
          linhas={linhas}
          servicos={servicosOrdenados}
          carregando={carregando}
          mensagemErro={mensagemErro}
          aoEditarCliente={abrirEdicaoServicosCliente}
        />
      </CorpoPagina>

      <ModalFiltrosServicos
        aberto={modalFiltrosAberto}
        filtros={filtros}
        vendedores={vendedores}
        conceitosCliente={conceitosCliente}
        gruposEmpresa={gruposEmpresa}
        estados={estadosClientes}
        servicos={servicosOrdenados}
        aoFechar={() => definirModalFiltrosAberto(false)}
        aoAplicar={(proximosFiltros) => {
          definirFiltros(normalizarFiltrosServicos(proximosFiltros));
          definirModalFiltrosAberto(false);
        }}
        aoLimpar={() => {
          definirFiltros({});
          return {};
        }}
      />

      <ModalEdicaoServicosCliente
        aberto={Boolean(clienteEmEdicao)}
        cliente={clienteEmEdicao}
        servicos={servicosOrdenados}
        formulario={formularioServicosCliente}
        salvando={salvandoServicosCliente}
        mensagemErro={mensagemErroModal}
        aoAlterarServico={alterarServicoClienteFormulario}
        aoFechar={fecharEdicaoServicosCliente}
        aoSalvar={salvarServicosCliente}
      />
    </>
  );
}

function criarFormularioServicosCliente(linha, servicos) {
  return (servicos || []).map((servico) => {
    const vinculo = linha?.servicosPorId?.get(String(servico.idServico));
    const situacao = obterSituacaoServicoCliente(vinculo);

    return {
      idClienteServico: vinculo?.idClienteServico || null,
      idServico: servico.idServico,
      descricaoServico: servico.descricao || `Servico #${servico.idServico}`,
      situacao,
      contratado: situacao === 'contratado',
      observacao: vinculo?.observacao || ''
    };
  });
}

function montarLinhasServicosCliente(clientes, clientesServicos, gruposEmpresa, conceitosCliente, empresa) {
  const gruposEmpresaPorId = new Map((gruposEmpresa || []).map((grupo) => [
    String(grupo.idGrupoEmpresa),
    grupo.descricao || ''
  ]));
  const conceitosClientePorId = new Map((conceitosCliente || []).map((conceito) => [
    String(conceito.idConceito),
    conceito.descricao || ''
  ]));

  return (clientes || []).map((cliente) => ({
    idCliente: cliente.idCliente,
    idVendedor: cliente.idVendedor,
    idConceito: cliente.idConceito,
    idGrupoEmpresa: cliente.idGrupoEmpresa,
    status: Number(cliente.status ?? 1) === 0 ? 'inativo' : 'ativo',
    estado: String(cliente.estado || '').trim().toUpperCase(),
    codigoCliente: obterCodigoPrincipalCliente(cliente, empresa) || cliente.idCliente,
    nomeFantasia: cliente.nomeFantasia || cliente.razaoSocial || `Cliente #${cliente.idCliente}`,
    grupoEmpresa: gruposEmpresaPorId.get(String(cliente.idGrupoEmpresa || '')) || 'Sem grupo',
    conceitoCliente: conceitosClientePorId.get(String(cliente.idConceito || '')) || 'Sem conceito',
    servicosPorId: montarMapaServicosCliente(clientesServicos, cliente.idCliente)
  })).sort((clienteA, clienteB) => (
    String(clienteA.nomeFantasia || '').localeCompare(String(clienteB.nomeFantasia || ''), 'pt-BR')
  ));
}

function montarMapaServicosCliente(clientesServicos, idCliente) {
  return new Map(
    (clientesServicos || [])
      .filter((vinculo) => String(vinculo.idCliente) === String(idCliente))
      .map((vinculo) => [String(vinculo.idServico), vinculo])
  );
}

function ordenarServicos(servicos) {
  return [...(servicos || [])].sort((servicoA, servicoB) => {
    const descricaoA = String(servicoA?.descricao || '').toLowerCase();
    const descricaoB = String(servicoB?.descricao || '').toLowerCase();

    return descricaoA.localeCompare(descricaoB, 'pt-BR');
  });
}

function filtrarLinhasServicosCliente(linhas, servicos, pesquisa, filtros) {
  const termo = String(pesquisa || '').trim().toLowerCase();

  return (linhas || []).filter((linha) => {
    const dadosCliente = [
      linha.codigoCliente,
      linha.nomeFantasia,
      linha.grupoEmpresa,
      linha.conceitoCliente
    ];

    const dadosServicos = servicos.flatMap((servico) => {
      const vinculo = linha.servicosPorId.get(String(servico.idServico));
      const situacao = obterSituacaoServicoCliente(vinculo);

      return [
        servico.descricao,
        obterRotuloSituacaoServicoCliente(situacao),
        situacao,
        vinculo?.observacao
      ];
    });

    const atendePesquisa = !termo || [...dadosCliente, ...dadosServicos].some((valor) => (
      String(valor || '').toLowerCase().includes(termo)
    ));

    return atendePesquisa && linhaAtendeFiltrosCliente(linha, filtros) && linhaAtendeFiltrosServicos(linha, filtros);
  });
}

function linhaAtendeFiltrosCliente(linha, filtros) {
  const vendedoresSelecionados = normalizarListaFiltroServicos(filtros?.idVendedor);
  const conceitosSelecionados = normalizarListaFiltroServicos(filtros?.idConceito);
  const gruposSelecionados = normalizarListaFiltroServicos(filtros?.idGrupoEmpresa);
  const statusSelecionados = normalizarListaFiltroServicos(filtros?.status);
  const estadosSelecionados = normalizarListaFiltroServicos(filtros?.estado).map((estado) => estado.toUpperCase());

  return (
    listaFiltroIncluiValor(vendedoresSelecionados, linha.idVendedor)
    && listaFiltroIncluiValor(conceitosSelecionados, linha.idConceito)
    && listaFiltroIncluiValor(gruposSelecionados, linha.idGrupoEmpresa)
    && listaFiltroIncluiValor(statusSelecionados, linha.status)
    && listaFiltroIncluiValor(estadosSelecionados, linha.estado)
  );
}

function linhaAtendeFiltrosServicos(linha, filtros) {
  const servicosSelecionados = Array.isArray(filtros?.servicos) ? filtros.servicos : [];

  if (servicosSelecionados.length === 0) {
    return true;
  }

  return servicosSelecionados.every((idServico) => {
    const vinculo = linha.servicosPorId.get(String(idServico));
    const situacao = obterSituacaoServicoCliente(vinculo);

    return situacao === 'contratado';
  });
}

function normalizarFiltrosServicos(filtros) {
  return {
    idVendedor: normalizarListaFiltroServicos(filtros?.idVendedor),
    idConceito: normalizarListaFiltroServicos(filtros?.idConceito),
    idGrupoEmpresa: normalizarListaFiltroServicos(filtros?.idGrupoEmpresa),
    status: normalizarListaFiltroServicos(filtros?.status).filter((valor) => ['ativo', 'inativo'].includes(valor)),
    estado: normalizarListaFiltroServicos(filtros?.estado).map((estado) => estado.toUpperCase()),
    servicos: normalizarListaFiltroServicos(filtros?.servicos)
  };
}

function filtrosServicosEstaoAtivos(filtros) {
  return Boolean(
    normalizarListaFiltroServicos(filtros?.idVendedor).length
    || normalizarListaFiltroServicos(filtros?.idConceito).length
    || normalizarListaFiltroServicos(filtros?.idGrupoEmpresa).length
    || normalizarListaFiltroServicos(filtros?.status).length
    || normalizarListaFiltroServicos(filtros?.estado).length
    || (Array.isArray(filtros?.servicos) && filtros.servicos.length > 0)
  );
}

function normalizarListaFiltroServicos(valor) {
  if (Array.isArray(valor)) {
    return valor.map((item) => String(item).trim()).filter(Boolean);
  }

  const texto = String(valor || '').trim();
  return texto ? [texto] : [];
}

function listaFiltroIncluiValor(lista, valor) {
  if (!Array.isArray(lista) || lista.length === 0) {
    return true;
  }

  return lista.includes(String(valor || ''));
}

function obterEstadosClientes(clientes) {
  return [...new Set(
    (clientes || [])
      .map((cliente) => String(cliente.estado || '').trim().toUpperCase())
      .filter(Boolean)
  )].sort((estadoA, estadoB) => estadoA.localeCompare(estadoB, 'pt-BR'));
}

function obterSituacaoServicoCliente(vinculo) {
  const situacao = String(vinculo?.situacao || '').trim();

  if (['contratado', 'naoContratado', 'naoAplicavel', 'terceiro'].includes(situacao)) {
    return situacao;
  }

  return vinculo?.contratado ? 'contratado' : 'naoContratado';
}

function obterRotuloSituacaoServicoCliente(situacao) {
  if (situacao === 'contratado') {
    return 'contratado sim check';
  }

  if (situacao === 'naoAplicavel') {
    return 'nao aplicavel n/a';
  }

  if (situacao === 'terceiro') {
    return 'terceiro alerta';
  }

  return 'nao contratado x';
}
