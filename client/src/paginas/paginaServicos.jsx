import { useEffect, useMemo, useState } from 'react';
import { ModalFiltros } from '../componentes/comuns/modalFiltros';
import { CorpoPagina } from '../componentes/layout/corpoPagina';
import { CabecalhoServicos } from '../componentes/modulos/servicos-cabecalhoServicos';
import { ListaServicos } from '../componentes/modulos/servicos-listaServicos';
import { listarClientes, listarClientesServicos } from '../servicos/clientes';
import { listarServicos } from '../servicos/servicos';
import { obterCodigoPrincipalCliente } from '../utilitarios/codigoCliente';
import '../recursos/estilos/paginaServicos.css';

export function PaginaServicos({ usuarioLogado }) {
  const [pesquisa, definirPesquisa] = useState('');
  const [modalFiltrosAberto, definirModalFiltrosAberto] = useState(false);
  const [filtros, definirFiltros] = useState({});
  const [clientes, definirClientes] = useState([]);
  const [servicos, definirServicos] = useState([]);
  const [clientesServicos, definirClientesServicos] = useState([]);
  const [carregando, definirCarregando] = useState(true);
  const [mensagemErro, definirMensagemErro] = useState('');

  useEffect(() => {
    carregarServicosClientes();
  }, []);

  const servicosOrdenados = useMemo(
    () => ordenarServicos(servicos),
    [servicos]
  );

  const linhas = useMemo(
    () => filtrarLinhasServicosCliente(
      montarLinhasServicosCliente(clientes, clientesServicos),
      servicosOrdenados,
      pesquisa,
      filtros
    ),
    [clientes, clientesServicos, pesquisa, servicosOrdenados, filtros]
  );

  const camposFiltros = useMemo(
    () => criarCamposFiltrosServicos(servicosOrdenados),
    [servicosOrdenados]
  );

  const filtrosAtivos = useMemo(
    () => Object.values(filtros).some((valor) => filtroServicoEstaAtivo(valor)),
    [filtros]
  );

  async function carregarServicosClientes() {
    definirCarregando(true);
    definirMensagemErro('');

    try {
      const resultados = await Promise.allSettled([
        listarClientes(),
        listarServicos({ incluirInativos: true }),
        listarClientesServicos()
      ]);

      const [
        clientesResultado,
        servicosResultado,
        clientesServicosResultado
      ] = resultados;

      definirClientes(clientesResultado.status === 'fulfilled' ? clientesResultado.value : []);
      definirServicos(servicosResultado.status === 'fulfilled' ? servicosResultado.value : []);
      definirClientesServicos(clientesServicosResultado.status === 'fulfilled' ? clientesServicosResultado.value : []);
    } catch (_erro) {
      definirMensagemErro('Nao foi possivel carregar os servicos por cliente.');
      definirClientes([]);
      definirServicos([]);
      definirClientesServicos([]);
    } finally {
      definirCarregando(false);
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
        />
      </CorpoPagina>

      <ModalFiltros
        aberto={modalFiltrosAberto}
        titulo="Filtros de servicos"
        campos={camposFiltros}
        filtros={filtros}
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
    </>
  );
}

function montarLinhasServicosCliente(clientes, clientesServicos) {
  return (clientes || []).map((cliente) => ({
    idCliente: cliente.idCliente,
    codigoCliente: obterCodigoPrincipalCliente(cliente) || cliente.idCliente,
    nomeFantasia: cliente.nomeFantasia || cliente.razaoSocial || `Cliente #${cliente.idCliente}`,
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
      linha.nomeFantasia
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

    return atendePesquisa && linhaAtendeFiltrosServicos(linha, servicos, filtros);
  });
}

function linhaAtendeFiltrosServicos(linha, servicos, filtros) {
  return servicos.every((servico) => {
    const valorFiltro = normalizarValorFiltroServico(filtros?.[criarNomeFiltroServico(servico.idServico)]);

    if (!filtroServicoEstaAtivo(valorFiltro)) {
      return true;
    }

    const vinculo = linha.servicosPorId.get(String(servico.idServico));
    const situacao = obterSituacaoServicoCliente(vinculo);

    if (valorFiltro === 'sim') {
      return situacao === 'contratado';
    }

    return situacao !== 'contratado';
  });
}

function criarCamposFiltrosServicos(servicos) {
  return (servicos || []).map((servico) => ({
    name: criarNomeFiltroServico(servico.idServico),
    label: servico.descricao || `Servico #${servico.idServico}`,
    placeholder: '-',
    options: [
      { valor: 'sim', label: 'Sim' },
      { valor: 'nao', label: 'Nao' }
    ]
  }));
}

function normalizarFiltrosServicos(filtros) {
  return Object.entries(filtros || {}).reduce((resultado, [chave, valor]) => {
    const valorNormalizado = normalizarValorFiltroServico(valor);

    if (filtroServicoEstaAtivo(valorNormalizado)) {
      resultado[chave] = valorNormalizado;
    }

    return resultado;
  }, {});
}

function criarNomeFiltroServico(idServico) {
  return `servico_${idServico}`;
}

function normalizarValorFiltroServico(valor) {
  const valorNormalizado = String(valor || '').trim().toLowerCase();

  if (valorNormalizado === 'sim' || valorNormalizado === 'nao') {
    return valorNormalizado;
  }

  return '';
}

function filtroServicoEstaAtivo(valor) {
  return ['sim', 'nao'].includes(normalizarValorFiltroServico(valor));
}

function obterSituacaoServicoCliente(vinculo) {
  const situacao = String(vinculo?.situacao || '').trim();

  if (['contratado', 'naoContratado', 'naoAplicavel'].includes(situacao)) {
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

  return 'nao contratado x';
}
