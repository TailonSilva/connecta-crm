export function formatarNomeContato(contato) {
  const nome = String(contato?.nome || '').trim();
  const cargo = String(contato?.cargo || '').trim();

  if (!nome) {
    return cargo || '';
  }

  return cargo ? `${nome} - ${cargo}` : nome;
}