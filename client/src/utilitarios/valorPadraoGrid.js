export function obterValorGrid(valor, fallback = '-') {
  if (valor === null || valor === undefined) {
    return fallback;
  }

  if (typeof valor === 'string') {
    const texto = valor.trim();
    return texto || fallback;
  }

  return valor;
}
