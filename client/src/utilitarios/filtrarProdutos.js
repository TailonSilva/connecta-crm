function normalizarTexto(valor) {
  return String(valor || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

import { normalizarPreco } from './normalizarPreco';

export function filtrarProdutos(produtos, pesquisa, filtros = {}) {
  const termo = normalizarTexto(pesquisa);

  return produtos.filter((produto) => {
    const passouFiltros = (
      (!filtros.idGrupo || String(produto.idGrupo) === String(filtros.idGrupo)) &&
      (!filtros.idMarca || String(produto.idMarca) === String(filtros.idMarca)) &&
      (!filtros.idUnidade || String(produto.idUnidade) === String(filtros.idUnidade)) &&
      (!filtros.status || String(Number(Boolean(produto.status))) === String(filtros.status))
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
