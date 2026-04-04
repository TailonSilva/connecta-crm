function normalizarTexto(valor) {
  return String(valor || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

import { normalizarPreco } from './normalizarPreco';

function incluiValorLista(lista, valorComparacao, normalizador = (valor) => String(valor || '')) {
  if (!Array.isArray(lista) || lista.length === 0) {
    return true;
  }

  const valorNormalizado = normalizador(valorComparacao);
  return lista.some((item) => normalizador(item) === valorNormalizado);
}

export function filtrarProdutos(produtos, pesquisa, filtros = {}) {
  const termo = normalizarTexto(pesquisa);

  return produtos.filter((produto) => {
    const passouFiltros = (
      incluiValorLista(filtros.idGrupo, produto.idGrupo) &&
      incluiValorLista(filtros.idMarca, produto.idMarca) &&
      incluiValorLista(filtros.idUnidade, produto.idUnidade) &&
      incluiValorLista(filtros.status, Number(Boolean(produto.status)))
    );

    if (!passouFiltros) {
      return false;
    }

    if (!termo) {
      return true;
    }

    const camposPesquisa = [
      produto.idProduto,
      produto.referencia,
      produto.descricao,
      produto.nomeGrupo,
      produto.nomeMarca,
      produto.nomeUnidade,
      normalizarPreco(produto.preco),
      produto.status ? 'ativo' : 'inativo'
    ];

    return camposPesquisa.some((campo) => normalizarTexto(campo).includes(termo));
  });
}
