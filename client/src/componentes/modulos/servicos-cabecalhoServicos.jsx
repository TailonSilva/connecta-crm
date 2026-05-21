import { Botao } from '../comuns/botao';
import { CampoPesquisa } from '../comuns/campoPesquisa';
import '../../recursos/estilos/cabecalhoPagina.css';

export function CabecalhoServicos({
  pesquisa,
  aoAlterarPesquisa,
  aoAbrirFiltros,
  filtrosAtivos = false
}) {
  return (
    <header className="cabecalhoPagina">
      <div>
        <h1>Servicos</h1>
        <p>Acompanhe os servicos contratados por cliente.</p>
      </div>

      <div className="acoesCabecalhoPagina">
        <CampoPesquisa
          valor={pesquisa}
          aoAlterar={aoAlterarPesquisa}
          placeholder="Pesquisar servicos"
          ariaLabel="Pesquisar servicos"
        />
        <Botao
          variante={filtrosAtivos ? 'primario' : 'secundario'}
          icone="filtro"
          somenteIcone
          title="Filtrar"
          aria-label="Filtrar"
          onClick={aoAbrirFiltros}
        />
      </div>
    </header>
  );
}
