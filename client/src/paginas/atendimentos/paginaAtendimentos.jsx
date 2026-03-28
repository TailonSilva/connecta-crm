import { CorpoPagina } from '../../componentes/layout/corpoPagina';
import { CartaoPaginaVazia } from '../../componentes/layout/cartaoPaginaVazia';

export function PaginaAtendimentos() {
  return (
    <>
      <header className="cabecalhoPagina">
        <div>
          <h1>Atendimentos</h1>
          <p>Base inicial para registrar atendimentos, evolucoes e proximas acoes.</p>
        </div>
      </header>

      <CorpoPagina>
        <div className="gradePainel">
          <CartaoPaginaVazia
            titulo="Lista de atendimentos"
            descricao="Espaco reservado para a grade principal de atendimentos e acompanhamentos."
          />
          <CartaoPaginaVazia
            titulo="Resumo do dia"
            descricao="Area preparada para indicadores, atalhos e status dos atendimentos."
          />
          <CartaoPaginaVazia
            titulo="Historico"
            descricao="Bloco pensado para ultimos registros, retornos e proximos contatos."
          />
          <CartaoPaginaVazia
            titulo="Observacoes"
            descricao="Espaco para informacoes complementares, lembretes e acoes futuras."
          />
        </div>
      </CorpoPagina>
    </>
  );
}
