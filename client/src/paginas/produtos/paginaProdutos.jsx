import { useEffect, useState } from 'react';
import { CabecalhoProdutos } from './cabecalhoProdutos';
import { CorpoProdutos } from './corpoProdutos';
import {
  atualizarProduto,
  incluirProduto,
  listarGruposProduto,
  listarMarcas,
  listarProdutos,
  listarUnidadesMedida
} from '../../servicos/produtos';
import { filtrarProdutos } from '../../utilitarios/filtrarProdutos';
import { converterPrecoParaNumero } from '../../utilitarios/normalizarPreco';
import { obterPrimeiroCodigoDisponivel } from '../../utilitarios/obterPrimeiroCodigoDisponivel';
import { ModalFiltros } from '../../componentes/comuns/modalFiltros';
import { ModalProduto } from './modalProduto';

const filtrosIniciaisProdutos = {
  idGrupo: '',
  idMarca: '',
  idUnidade: '',
  status: ''
};

export function PaginaProdutos({ usuarioLogado }) {
  const [pesquisa, definirPesquisa] = useState('');
  const [filtros, definirFiltros] = useState(filtrosIniciaisProdutos);
  const [produtos, definirProdutos] = useState([]);
  const [gruposProduto, definirGruposProduto] = useState([]);
  const [marcas, definirMarcas] = useState([]);
  const [unidadesMedida, definirUnidadesMedida] = useState([]);
  const [carregando, definirCarregando] = useState(true);
  const [mensagemErro, definirMensagemErro] = useState('');
  const [modalAberto, definirModalAberto] = useState(false);
  const [modalFiltrosAberto, definirModalFiltrosAberto] = useState(false);
  const [produtoSelecionado, definirProdutoSelecionado] = useState(null);
  const [modoModalProduto, definirModoModalProduto] = useState('novo');
  const usuarioSomenteConsulta = usuarioLogado?.tipo === 'Usuario padrao';

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    definirCarregando(true);
    definirMensagemErro('');

    try {
      const [
        produtosCarregados,
        gruposCarregados,
        marcasCarregadas,
        unidadesCarregadas
      ] = await Promise.all([
        listarProdutos(),
        listarGruposProduto(),
        listarMarcas(),
        listarUnidadesMedida()
      ]);

      definirProdutos(
        enriquecerProdutos(
          produtosCarregados,
          gruposCarregados,
          marcasCarregadas,
          unidadesCarregadas
        )
      );
      definirGruposProduto(gruposCarregados);
      definirMarcas(marcasCarregadas);
      definirUnidadesMedida(unidadesCarregadas);
    } catch (erro) {
      definirMensagemErro('Nao foi possivel carregar os produtos.');
    } finally {
      definirCarregando(false);
    }
  }

  async function salvarProduto(dadosProduto) {
    const payload = normalizarPayloadProduto({
      ...dadosProduto,
      idProduto: produtoSelecionado?.idProduto || proximoCodigoProduto
    });

    if (modoModalProduto === 'edicao' && produtoSelecionado?.idProduto) {
      await atualizarProduto(produtoSelecionado.idProduto, payload);
    } else {
      await incluirProduto(payload);
    }

    await carregarDados();
    fecharModalProduto();
  }

  async function inativarProduto(produto) {
    if (usuarioSomenteConsulta) {
      return;
    }

    await atualizarProduto(produto.idProduto, { status: 0 });
    await carregarDados();
  }

  function abrirNovoProduto() {
    if (usuarioSomenteConsulta) {
      return;
    }

    definirProdutoSelecionado(null);
    definirModoModalProduto('novo');
    definirModalAberto(true);
  }

  function abrirEdicaoProduto(produto) {
    if (usuarioSomenteConsulta) {
      abrirConsultaProduto(produto);
      return;
    }

    definirProdutoSelecionado(produto);
    definirModoModalProduto('edicao');
    definirModalAberto(true);
  }

  function abrirConsultaProduto(produto) {
    definirProdutoSelecionado(produto);
    definirModoModalProduto('consulta');
    definirModalAberto(true);
  }

  function fecharModalProduto() {
    definirModalAberto(false);
    definirProdutoSelecionado(null);
    definirModoModalProduto('novo');
  }

  const produtosFiltrados = filtrarProdutos(produtos, pesquisa, filtros);
  const proximoCodigoProduto = obterPrimeiroCodigoDisponivel(produtos, 'idProduto');
  const filtrosAtivos = Object.values(filtros).some(Boolean);

  return (
    <>
      <CabecalhoProdutos
        pesquisa={pesquisa}
        aoAlterarPesquisa={definirPesquisa}
        aoAbrirFiltros={() => definirModalFiltrosAberto(true)}
        aoNovoProduto={abrirNovoProduto}
        filtrosAtivos={filtrosAtivos}
        somenteConsulta={usuarioSomenteConsulta}
      />
      <CorpoProdutos
        produtos={produtosFiltrados}
        carregando={carregando}
        mensagemErro={mensagemErro}
        aoConsultarProduto={abrirConsultaProduto}
        aoEditarProduto={abrirEdicaoProduto}
        aoInativarProduto={inativarProduto}
        somenteConsulta={usuarioSomenteConsulta}
      />
      <ModalFiltros
        aberto={modalFiltrosAberto}
        titulo="Filtros de produtos"
        filtros={filtros}
        campos={[
          {
            name: 'idGrupo',
            label: 'Grupo',
            options: gruposProduto.map((grupo) => ({
              valor: String(grupo.idGrupo),
              label: grupo.descricao
            }))
          },
          {
            name: 'idMarca',
            label: 'Marca',
            options: marcas.map((marca) => ({
              valor: String(marca.idMarca),
              label: marca.descricao
            }))
          },
          {
            name: 'idUnidade',
            label: 'Unidade',
            options: unidadesMedida.map((unidade) => ({
              valor: String(unidade.idUnidade),
              label: unidade.descricao
            }))
          },
          {
            name: 'status',
            label: 'Ativo',
            options: [
              { valor: '1', label: 'Ativo' },
              { valor: '0', label: 'Inativo' }
            ]
          }
        ]}
        aoFechar={() => definirModalFiltrosAberto(false)}
        aoAplicar={(proximosFiltros) => {
          definirFiltros(proximosFiltros);
          definirModalFiltrosAberto(false);
        }}
        aoLimpar={() => definirFiltros(filtrosIniciaisProdutos)}
      />
      <ModalProduto
        aberto={modalAberto}
        produto={produtoSelecionado}
        codigoSugerido={proximoCodigoProduto}
        gruposProduto={gruposProduto}
        marcas={marcas}
        unidadesMedida={unidadesMedida}
        modo={modoModalProduto}
        aoFechar={fecharModalProduto}
        aoSalvar={salvarProduto}
      />
    </>
  );
}

function enriquecerProdutos(produtos, grupos, marcas, unidades) {
  const gruposPorId = new Map(
    grupos.map((grupo) => [grupo.idGrupo, grupo.descricao])
  );
  const marcasPorId = new Map(
    marcas.map((marca) => [marca.idMarca, marca.descricao])
  );
  const unidadesPorId = new Map(
    unidades.map((unidade) => [unidade.idUnidade, unidade.descricao])
  );

  return produtos.map((produto) => ({
    ...produto,
    nomeGrupo: gruposPorId.get(produto.idGrupo) || 'Nao informado',
    nomeMarca: marcasPorId.get(produto.idMarca) || 'Nao informado',
    nomeUnidade: unidadesPorId.get(produto.idUnidade) || 'Nao informado'
  }));
}

function normalizarPayloadProduto(dadosProduto) {
  const payload = {
    referencia: dadosProduto.referencia.trim(),
    descricao: dadosProduto.descricao.trim(),
    idGrupo: Number(dadosProduto.idGrupo),
    idMarca: Number(dadosProduto.idMarca),
    idUnidade: Number(dadosProduto.idUnidade),
    preco: converterPrecoParaNumero(dadosProduto.preco) || 0,
    imagem: limparTextoOpcional(dadosProduto.imagem),
    status: dadosProduto.status ? 1 : 0
  };

  if (dadosProduto.idProduto) {
    payload.idProduto = Number(dadosProduto.idProduto);
  }

  return payload;
}

function limparTextoOpcional(valor) {
  const texto = String(valor || '').trim();
  return texto || null;
}
