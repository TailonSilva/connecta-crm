import { useEffect } from 'react';

// `encontrarModalAtivo` vem de `../utilitarios/interacoesGlobaisModais` e resolve qual modal esta no topo da pilha visual.
// `navegarEntreAbasModal` vem do mesmo utilitario e conhece a estrutura padrao de abas adotada no projeto.
import {
  encontrarModalAtivo,
  navegarEntreAbasModal
} from '../utilitarios/interacoesGlobaisModais';

// Este hook registra os atalhos `Alt + Seta` para trocar abas sem depender do mouse.
// Mantemos essa regra em um hook global porque a navegacao deve funcionar em qualquer modal que siga o padrao do projeto.
export function useAtalhoNavegacaoAbasModal() {
  // `useEffect` com dependencia vazia garante que o listener seja conectado uma vez e limpo corretamente no unmount.
  useEffect(() => {
    // Esta funcao intercepta as teclas de navegacao e delega a troca de abas ao utilitario compartilhado.
    function tratarNavegacaoAbasModal(evento) {
      // So reagimos quando o usuario pressiona `Alt` junto com seta esquerda ou direita.
      if (!evento.altKey || (evento.key !== 'ArrowLeft' && evento.key !== 'ArrowRight')) {
        return;
      }

      // Buscamos apenas modais do tipo dialog comum porque `alertdialog` representa confirmacoes e nao fluxo com abas.
      const modalAtivo = encontrarModalAtivo({ incluirAlertDialog: false });

      // Se nao houver modal ativo, o atalho nao deve fazer nada.
      if (!modalAtivo) {
        return;
      }

      // Cancelamos o comportamento padrao para impedir que o navegador ou o cursor usem a mesma combinacao.
      evento.preventDefault();
      // `1` avanca para a proxima aba e `-1` volta para a anterior, mantendo a regra de navegacao centralizada no utilitario.
      navegarEntreAbasModal(modalAtivo, evento.key === 'ArrowRight' ? 1 : -1);
    }

    // Usamos captura (`true`) para interceptar a tecla antes de outros elementos consumirem o evento.
    window.addEventListener('keydown', tratarNavegacaoAbasModal, true);

    // Removemos exatamente o mesmo listener e a mesma fase de captura para evitar vazamentos e duplicidade.
    return () => {
      window.removeEventListener('keydown', tratarNavegacaoAbasModal, true);
    };
  }, []);
}
