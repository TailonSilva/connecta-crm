import { useState } from 'react';
import { PaginaAgenda } from './paginas/agenda/paginaAgenda';
import { PaginaAtendimentos } from './paginas/atendimentos/paginaAtendimentos';
import { BarraLateral } from './componentes/layout/barraLateral';
import { PaginaClientes } from './paginas/clientes/paginaClientes';
import { PaginaConfiguracoes } from './paginas/configuracoes/paginaConfiguracoes';
import { PaginaLogin } from './paginas/login/paginaLogin';
import { PaginaPadrao } from './paginas/padrao/paginaPadrao';
import { PaginaProdutos } from './paginas/produtos/paginaProdutos';
import {
  limparSessaoUsuario,
  obterSessaoUsuario,
  salvarSessaoUsuario
} from './servicos/autenticacao';
import { paginasPainel } from './utilitarios/paginas';

function renderizarPagina(paginaSelecionada, usuarioLogado) {
  if (paginaSelecionada.id === 'clientes') {
    return <PaginaClientes usuarioLogado={usuarioLogado} />;
  }

  if (paginaSelecionada.id === 'agenda') {
    return <PaginaAgenda usuarioLogado={usuarioLogado} />;
  }

  if (paginaSelecionada.id === 'atendimentos') {
    return <PaginaAtendimentos usuarioLogado={usuarioLogado} />;
  }

  if (paginaSelecionada.id === 'produtos') {
    return <PaginaProdutos usuarioLogado={usuarioLogado} />;
  }

  if (paginaSelecionada.id === 'configuracoes') {
    return <PaginaConfiguracoes usuarioLogado={usuarioLogado} />;
  }

  return <PaginaPadrao pagina={paginaSelecionada} />;
}

export default function App() {
  const [paginaAtiva, definirPaginaAtiva] = useState(paginasPainel[0].id);
  const [usuarioLogado, definirUsuarioLogado] = useState(obterSessaoUsuario);

  const paginaSelecionada =
    paginasPainel.find((pagina) => pagina.id === paginaAtiva) || paginasPainel[0];

  function entrar(usuario) {
    salvarSessaoUsuario(usuario);
    definirUsuarioLogado(usuario);
  }

  function sair() {
    limparSessaoUsuario();
    definirUsuarioLogado(null);
  }

  if (!usuarioLogado) {
    return <PaginaLogin aoEntrar={entrar} />;
  }

  return (
    <main className="aplicacao">
      <div className="estruturaPainel">
        <BarraLateral
          itens={paginasPainel}
          paginaAtiva={paginaAtiva}
          usuarioLogado={usuarioLogado}
          aoSelecionarPagina={definirPaginaAtiva}
          aoSair={sair}
        />

        <section className="areaConteudo">
          {renderizarPagina(paginaSelecionada, usuarioLogado)}
        </section>
      </div>
    </main>
  );
}
