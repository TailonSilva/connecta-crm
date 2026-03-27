import { Icone } from './icone';

export function CampoPesquisa({
  valor,
  aoAlterar,
  placeholder = 'Pesquisar...',
  ariaLabel = 'Pesquisar'
}) {
  return (
    <label className="campoPesquisa">
      <Icone nome="pesquisa" className="iconeCampoPesquisa" />
      <input
        className="entradaCampoPesquisa"
        type="search"
        value={valor}
        onChange={(evento) => aoAlterar(evento.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />
    </label>
  );
}
