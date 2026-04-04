function normalizarTexto(valor) {
  return String(valor || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function incluiValorLista(lista, valorComparacao, normalizador = (valor) => String(valor || '')) {
  if (!Array.isArray(lista) || lista.length === 0) {
    return true;
  }

  const valorNormalizado = normalizador(valorComparacao);
  return lista.some((item) => normalizador(item) === valorNormalizado);
}

export function filtrarClientes(clientes, pesquisa, filtros = {}) {
  const termo = normalizarTexto(pesquisa);

  return clientes.filter((cliente) => {
    const passouFiltros = (
      incluiValorLista(filtros.estado, cliente.estado, normalizarTexto) &&
      (!filtros.cidade || normalizarTexto(cliente.cidade) === normalizarTexto(filtros.cidade)) &&
      (!filtros.idGrupoEmpresa || String(cliente.idGrupoEmpresa) === String(filtros.idGrupoEmpresa)) &&
      incluiValorLista(filtros.idRamo, cliente.idRamo) &&
      incluiValorLista(filtros.idVendedor, cliente.idVendedor) &&
      incluiValorLista(filtros.tipo, cliente.tipo, normalizarTexto) &&
      incluiValorLista(filtros.status, Number(Boolean(cliente.status)))
    );

    if (!passouFiltros) {
      return false;
    }

    if (!termo) {
      return true;
    }

    const camposPesquisa = [
      cliente.idCliente,
      cliente.codigoAlternativo,
      cliente.nomeFantasia,
      cliente.razaoSocial,
      cliente.cnpj,
      cliente.cidade,
      cliente.estado,
      cliente.nomeGrupoEmpresa,
      cliente.nomeContatoPrincipal,
      cliente.emailContatoPrincipal,
      cliente.nomeVendedor,
      cliente.status ? 'ativo' : 'inativo'
    ];

    return camposPesquisa.some((campo) => normalizarTexto(campo).includes(termo));
  });
}
