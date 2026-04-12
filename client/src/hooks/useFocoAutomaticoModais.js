import { useEffect } from 'react';

// `aplicarFocoNoModalAtivo` vem de `../utilitarios/interacoesGlobaisModais` e conhece a regra global de foco inicial dos modais.
import { aplicarFocoNoModalAtivo } from '../utilitarios/interacoesGlobaisModais';

// Este hook observa a arvore de modais para reaplicar foco sempre que um dialog abre, troca de estado ou muda de conteudo.
// Mantemos essa regra centralizada para que cada modal nao precise implementar manualmente sua propria logica de foco inicial.
export function useFocoAutomaticoModais() {
  // `useEffect` com dependencia vazia instala o observador uma vez enquanto a aplicacao estiver ativa.
  useEffect(() => {
    // Estes identificadores permitem cancelar agendamentos anteriores quando varias mutacoes acontecem em sequencia.
    let frameAtual = null;
    let timeoutAtual = null;

    // Agendamos o foco em duas etapas para esperar React, CSS e DOM terminarem de refletir a mudanca visual do modal.
    function agendarAplicacaoFoco() {
      // Cancelamos o `requestAnimationFrame` anterior para evitar aplicar foco varias vezes para a mesma leva de mutacoes.
      if (frameAtual !== null) {
        window.cancelAnimationFrame(frameAtual);
      }

      // Cancelamos tambem o `setTimeout` pendente para manter apenas a ultima tentativa ativa.
      if (timeoutAtual !== null) {
        window.clearTimeout(timeoutAtual);
      }

      // O frame espera a proxima pintura e o timeout empurra o foco para depois das atualizacoes sincronas restantes.
      frameAtual = window.requestAnimationFrame(() => {
        timeoutAtual = window.setTimeout(() => {
          aplicarFocoNoModalAtivo();
        }, 0);
      });
    }

    // O `MutationObserver` detecta aberturas, trocas de classe e estados relevantes de elementos do modal.
    const observador = new MutationObserver(() => {
      agendarAplicacaoFoco();
    });

    // Observamos o `document.body` porque os modais podem ser montados em diferentes pontos da arvore.
    observador.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'open', 'aria-hidden', 'disabled']
    });

    // Fazemos uma tentativa inicial para cobrir modais que ja estiverem presentes no momento da montagem.
    agendarAplicacaoFoco();

    // A limpeza encerra o observador e cancela qualquer agendamento ainda pendente.
    return () => {
      observador.disconnect();

      if (frameAtual !== null) {
        window.cancelAnimationFrame(frameAtual);
      }

      if (timeoutAtual !== null) {
        window.clearTimeout(timeoutAtual);
      }
    };
  }, []);
}
