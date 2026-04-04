import { Botao } from './botao';
import { ModalHistoricoGrade } from './modalHistoricoGrade';
import '../../recursos/estilos/modalRelatorioGrade.css';

export function ModalRelatorioGrade({
  aberto,
  titulo,
  subtitulo = '',
  chips = [],
  filtrosAtivos = false,
  tituloFiltro = 'Filtrar',
  ariaFiltro = 'Filtrar',
  onAbrirFiltros,
  acaoPdf = null,
  onFechar,
  cards = [],
  children
}) {
  return (
    <ModalHistoricoGrade
      aberto={aberto}
      titulo={titulo}
      subtitulo={subtitulo}
      className="modalRelatorioGrade"
      chipsCabecalho={chips}
      filtrosAtivos={filtrosAtivos}
      tituloFiltro={tituloFiltro}
      ariaFiltro={ariaFiltro}
      onAbrirFiltros={onAbrirFiltros}
      acaoCabecalho={acaoPdf ? (
        <Botao
          variante="secundario"
          type="button"
          icone="pdf"
          somenteIcone
          title={acaoPdf.title}
          aria-label={acaoPdf.ariaLabel || acaoPdf.title}
          disabled={acaoPdf.disabled}
          onClick={acaoPdf.onClick}
        >
          {acaoPdf.title}
        </Botao>
      ) : null}
      onFechar={onFechar}
    >
      <section className="modalRelatorioGradeConteudo">
        {Array.isArray(cards) && cards.length > 0 ? (
          <div className="modalRelatorioGradeCards">
            {cards.map((card) => (
              <article key={card.titulo} className="modalRelatorioGradeCard">
                <span className="modalRelatorioGradeCardRotulo">{card.titulo}</span>
                <strong className="modalRelatorioGradeCardValor">{card.valor}</strong>
              </article>
            ))}
          </div>
        ) : null}

        {children}
      </section>
    </ModalHistoricoGrade>
  );
}