function normalizarTexto(valor) {
  return String(valor || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function formatarPrecoPesquisa(valor) {
  const numero = Number(valor || 0);

  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

export function filtrarProdutos(produtos, pesquisa) {
  const termo = normalizarTexto(pesquisa);

  if (!termo) {
    return produtos;
  }

  return produtos.filter((produto) => {
    const camposPesquisa = [
      produto.idProduto,
      produto.referencia,
      produto.descricao,
      produto.nomeGrupo,
      produto.nomeMarca,
      produto.nomeUnidade,
      formatarPrecoPesquisa(produto.preco),
      produto.status ? 'ativo' : 'inativo'
    ];

    return camposPesquisa.some((campo) => normalizarTexto(campo).includes(termo));
  });
}
