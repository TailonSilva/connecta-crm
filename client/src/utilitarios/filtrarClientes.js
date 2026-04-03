function normalizarTexto(valor) {
  return String(valor || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function filtrarClientes(clientes, pesquisa, filtros = {}) {
  const termo = normalizarTexto(pesquisa);

  return clientes.filter((cliente) => {
    const passouFiltros = (
      (!filtros.estado || normalizarTexto(cliente.estado) === normalizarTexto(filtros.estado)) &&
      (!filtros.cidade || normalizarTexto(cliente.cidade) === normalizarTexto(filtros.cidade)) &&
      (!filtros.idGrupoEmpresa || String(cliente.idGrupoEmpresa) === String(filtros.idGrupoEmpresa)) &&
      (!filtros.idRamo || String(cliente.idRamo) === String(filtros.idRamo)) &&
      (!filtros.idVendedor || String(cliente.idVendedor) === String(filtros.idVendedor)) &&
      (!filtros.tipo || normalizarTexto(cliente.tipo) === normalizarTexto(filtros.tipo)) &&
      (!filtros.status || String(Number(Boolean(cliente.status))) === String(filtros.status))
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
