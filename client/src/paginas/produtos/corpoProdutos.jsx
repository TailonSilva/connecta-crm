import { useEffect, useState } from 'react';
import { CorpoPagina } from '../../componentes/layout/corpoPagina';
import {
  listarGruposProduto,
  listarMarcas,
  listarProdutos,
  listarUnidadesMedida
} from '../../servicos/produtos';
import { filtrarProdutos } from '../../utilitarios/filtrarProdutos';
import { ListaProdutos } from './listaProdutos';

export function CorpoProdutos({ pesquisa }) {
  const [produtos, definirProdutos] = useState([]);
  const [carregando, definirCarregando] = useState(true);
  const [mensagemErro, definirMensagemErro] = useState('');

  useEffect(() => {
    async function carregarProdutos() {
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

        const gruposPorId = new Map(
          gruposCarregados.map((grupo) => [grupo.idGrupo, grupo.descricao])
        );
        const marcasPorId = new Map(
          marcasCarregadas.map((marca) => [marca.idMarca, marca.descricao])
        );
        const unidadesPorId = new Map(
          unidadesCarregadas.map((unidade) => [unidade.idUnidade, unidade.descricao])
        );

        const produtosFormatados = produtosCarregados.map((produto) => ({
          ...produto,
          nomeGrupo: gruposPorId.get(produto.idGrupo) || 'Nao informado',
          nomeMarca: marcasPorId.get(produto.idMarca) || 'Nao informado',
          nomeUnidade: unidadesPorId.get(produto.idUnidade) || 'Nao informado'
        }));

        definirProdutos(produtosFormatados);
      } catch (erro) {
        definirMensagemErro('Nao foi possivel carregar os produtos.');
      } finally {
        definirCarregando(false);
      }
    }

    carregarProdutos();
  }, []);

  const produtosFiltrados = filtrarProdutos(produtos, pesquisa);

  return (
    <CorpoPagina>
      <div className="gradePainelProdutos">
        <ListaProdutos
          produtos={produtosFiltrados}
          carregando={carregando}
          mensagemErro={mensagemErro}
        />
      </div>
    </CorpoPagina>
  );
}
