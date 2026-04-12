import { useEffect, useState } from 'react';

// Estes servicos de `../servicos/autenticacao` encapsulam leitura e escrita da sessao persistida fora do React.
import {
  limparSessaoUsuario,
  obterSessaoUsuario,
  salvarSessaoUsuario
} from '../servicos/autenticacao';

// Este hook centraliza a sessao do usuario no frontend para que o `App` so precise consumir estado e acoes prontas.
// A ideia e esconder a regra de persistencia e sincronizacao de eventos atras de uma interface simples.
export function useSessaoSincronizada() {
  // Usamos inicializador lazy para consultar a sessao persistida apenas na primeira montagem do hook.
  const [usuarioLogado, definirUsuarioLogado] = useState(obterSessaoUsuario);

  // Este efeito escuta o evento global disparado quando outra parte da aplicacao atualiza a sessao.
  useEffect(() => {
    // A funcao extrai o usuario do `detail` do evento e sincroniza React e persistencia local.
    function tratarUsuarioLogadoAtualizado(evento) {
      const proximoUsuario = evento.detail?.usuario || null;

      // Sem usuario valido nao persistimos nada para evitar sobrescrever a sessao com payload quebrado.
      if (!proximoUsuario) {
        return;
      }

      // Persistimos antes de atualizar o estado para manter a sessao consistente mesmo em recarregamentos imediatos.
      salvarSessaoUsuario(proximoUsuario);
      definirUsuarioLogado(proximoUsuario);
    }

    // O listener fica no `window` porque o evento pode ser emitido por qualquer modulo do frontend.
    window.addEventListener('usuario-logado-atualizado', tratarUsuarioLogadoAtualizado);

    // A limpeza remove o listener para evitar duplicidade se o hook for remontado.
    return () => {
      window.removeEventListener('usuario-logado-atualizado', tratarUsuarioLogadoAtualizado);
    };
  }, []);

  // Esta acao e usada pelo fluxo de login para aplicar um usuario autenticado na sessao atual.
  function entrar(usuario) {
    salvarSessaoUsuario(usuario);
    definirUsuarioLogado(usuario);
  }

  // Esta acao limpa a sessao persistida e zera o estado React para derrubar o contexto autenticado.
  function sair() {
    limparSessaoUsuario();
    definirUsuarioLogado(null);
  }

  // Retornamos o estado e as acoes principais para o `App` e outros consumidores lidarem com autenticacao de forma simples.
  return {
    usuarioLogado,
    definirUsuarioLogado,
    entrar,
    sair
  };
}
