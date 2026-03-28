export function obterPrimeiroCodigoDisponivel(registros, chavePrimaria) {
  const codigosExistentes = new Set(
    (registros || [])
      .map((registro) => Number(registro?.[chavePrimaria]))
      .filter((codigo) => Number.isInteger(codigo) && codigo > 0)
  );

  let codigo = 1;

  while (codigosExistentes.has(codigo)) {
    codigo += 1;
  }

  return codigo;
}
