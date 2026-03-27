function normalizarTexto(valor) {
  return String(valor || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function filtrarClientes(clientes, pesquisa) {
  const termo = normalizarTexto(pesquisa);

  if (!termo) {
    return clientes;
  }

  return clientes.filter((cliente) => {
    const camposPesquisa = [
      cliente.idCliente,
      cliente.nomeFantasia,
      cliente.razaoSocial,
      cliente.cnpj,
      cliente.cidade,
      cliente.estado,
      cliente.nomeContatoPrincipal,
      cliente.emailContatoPrincipal,
      cliente.nomeVendedor,
      cliente.status ? 'ativo' : 'inativo'
    ];

    return camposPesquisa.some((campo) => normalizarTexto(campo).includes(termo));
  });
}
