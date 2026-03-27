import { Botao } from '../../componentes/comuns/botao';
import { CampoPesquisa } from '../../componentes/comuns/campoPesquisa';

export function CabecalhoClientes({ pesquisa, aoAlterarPesquisa }) {
  return (
    <header className="cabecalhoPagina">
      <div>
        <h1>Clientes</h1>
        <p>Gerencie o cadastro e a consulta dos clientes do CRM.</p>
      </div>

      <div className="acoesCabecalhoPagina">
        <CampoPesquisa
          valor={pesquisa}
          aoAlterar={aoAlterarPesquisa}
          placeholder="Pesquisar clientes"
          ariaLabel="Pesquisar clientes"
        />
        <Botao variante="secundario" icone="filtro" somenteIcone title="Filtrar" aria-label="Filtrar" />
        <Botao variante="secundario" icone="importar" somenteIcone title="Importar" aria-label="Importar" />
        <Botao variante="primario" icone="adicionar" somenteIcone title="Novo cliente" aria-label="Novo cliente" />
      </div>
    </header>
  );
}
