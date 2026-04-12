import { useEffect } from 'react';

// `encontrarBotaoAcaoPrimariaPageDown` vem de `../utilitarios/interacoesGlobaisModais` e centraliza a regra de qual acao primaria deve responder ao `PageDown`.
import { encontrarBotaoAcaoPrimariaPageDown } from '../utilitarios/interacoesGlobaisModais';

// Este hook existe para registrar uma unica vez o atalho global `PageDown` enquanto a aplicacao estiver montada.
// Usamos um hook sem retorno porque o objetivo aqui e so conectar e desconectar um listener global do navegador.
export function useAtalhoAcaoPrimaria() {
  // `useEffect` com dependencia vazia roda apenas na montagem e limpeza do ciclo de vida deste hook.
  useEffect(() => {
    // Esta funcao trata cada tecla pressionada e decide se a interface deve acionar a acao primaria atual.
    function tratarAtalhoAcaoPrimaria(evento) {
      // Ignoramos qualquer tecla diferente de `PageDown` para nao interferir na digitacao normal do sistema.
      if (evento.key !== 'PageDown') {
        return;
      }

      // A decisao do botao alvo fica fora do hook para manter este arquivo focado em comportamento React e nao em busca de DOM.
      const botaoAcaoPrimaria = encontrarBotaoAcaoPrimariaPageDown();

      // Se nao houver botao compativel no modal ou na pagina atual, encerramos sem produzir efeito colateral.
      if (!botaoAcaoPrimaria) {
        return;
      }

      // Cancelamos o comportamento padrao do navegador para garantir que o atalho seja consumido pela aplicacao.
      evento.preventDefault();
      // Simulamos o clique do usuario no botao encontrado para reutilizar a mesma regra de submit ou inclusao ja existente na tela.
      botaoAcaoPrimaria.click();
    }

    // Registramos o listener no `window` porque o atalho precisa funcionar independentemente do foco atual na tela.
    window.addEventListener('keydown', tratarAtalhoAcaoPrimaria);

    // A limpeza remove o listener para evitar duplicidade caso o hook seja remontado.
    return () => {
      window.removeEventListener('keydown', tratarAtalhoAcaoPrimaria);
    };
  }, []);
}
