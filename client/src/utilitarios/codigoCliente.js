export function normalizarCodigoClienteNumerico(valor) {
  return String(valor ?? '').replace(/\D/g, '').trim();
}

export function usarCodigoAlternativoCliente(empresa) {
  return String(empresa?.codigoPrincipalCliente || '').trim() === 'codigoAlternativo';
}

export function obterCodigoPrincipalCliente(cliente, empresa) {
  const codigoAlternativo = normalizarCodigoClienteNumerico(cliente?.codigoAlternativo);

  if (usarCodigoAlternativoCliente(empresa) && codigoAlternativo) {
    return codigoAlternativo;
  }

  return normalizarCodigoClienteNumerico(cliente?.idCliente);
}

export function formatarCodigoCliente(cliente, empresa) {
  const codigo = obterCodigoPrincipalCliente(cliente, empresa);
  return `#${String(codigo || 0).padStart(4, '0')}`;
}