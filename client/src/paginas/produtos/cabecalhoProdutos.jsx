import { Botao } from '../../componentes/comuns/botao';
import { CampoPesquisa } from '../../componentes/comuns/campoPesquisa';

export function CabecalhoProdutos({ pesquisa, aoAlterarPesquisa }) {
  return (
    <header className="cabecalhoPagina">
      <div>
        <h1>Produtos</h1>
        <p>Gerencie o catalogo e a consulta dos produtos do CRM.</p>
      </div>

      <div className="acoesCabecalhoPagina">
        <CampoPesquisa
          valor={pesquisa}
          aoAlterar={aoAlterarPesquisa}
          placeholder="Pesquisar produtos"
          ariaLabel="Pesquisar produtos"
        />
        <Botao variante="secundario" icone="filtro" somenteIcone title="Filtrar" aria-label="Filtrar" />
        <Botao variante="secundario" icone="importar" somenteIcone title="Importar" aria-label="Importar" />
        <Botao variante="primario" icone="adicionar" somenteIcone title="Novo produto" aria-label="Novo produto" />
      </div>
    </header>
  );
}
