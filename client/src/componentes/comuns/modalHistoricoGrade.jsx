import { Botao } from './botao';
import '../../recursos/estilos/modalHistoricoGrade.css';

export function ModalHistoricoGrade({
  aberto,
  titulo,
  subtitulo = '',
  filtrosAtivos = false,
  tituloFiltro = 'Filtrar',
  ariaFiltro = 'Filtrar',
  onAbrirFiltros,
  onFechar,
  abas = [],
  abaAtiva = '',
  onSelecionarAba,
  abasNoCabecalho = false,
  children
}) {
  if (!aberto) {
    return null;
  }

  const exibirAbas = Array.isArray(abas) && abas.length > 0;
  const exibirAbasNoCabecalho = exibirAbas && abasNoCabecalho;

  return (
    <div className="camadaModal camadaModalSecundaria" role="presentation" onMouseDown={onFechar}>
      <section
        className="modalCliente modalHistoricoGrade"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`titulo${normalizarIdModal(titulo)}`}
        onMouseDown={(evento) => evento.stopPropagation()}
      >
        <header className="cabecalhoModalCliente">
          <div className="modalHistoricoGradeCabecalhoTexto">
            <h2 id={`titulo${normalizarIdModal(titulo)}`}>{titulo}</h2>
            {subtitulo ? <p className="modalHistoricoGradeSubtitulo">{subtitulo}</p> : null}
          </div>

          <div className="acoesCabecalhoModalCliente">
            {exibirAbasNoCabecalho || typeof onAbrirFiltros === 'function' ? (
              <div className="modalHistoricoGradeControlesCabecalho">
                {exibirAbasNoCabecalho ? (
                  <div className="modalHistoricoGradeAbasCabecalho" role="tablist" aria-label={titulo}>
                    {abas.map((aba) => (
                      <button
                        key={aba.id}
                        type="button"
                        role="tab"
                        className={`abaModalCliente ${abaAtiva === aba.id ? 'ativa' : ''}`}
                        aria-selected={abaAtiva === aba.id}
                        onClick={() => onSelecionarAba?.(aba.id)}
                      >
                        {aba.label}
                      </button>
                    ))}
                  </div>
                ) : null}
                {typeof onAbrirFiltros === 'function' ? (
                  <Botao
                    variante={filtrosAtivos ? 'primario' : 'secundario'}
                    type="button"
                    icone="filtro"
                    somenteIcone
                    title={tituloFiltro}
                    aria-label={ariaFiltro}
                    onClick={onAbrirFiltros}
                  >
                    {tituloFiltro}
                  </Botao>
                ) : null}
              </div>
            ) : null}
            <Botao variante="secundario" type="button" onClick={onFechar}>
              Fechar
            </Botao>
          </div>
        </header>

        {exibirAbas && !exibirAbasNoCabecalho ? (
          <div className="abasModalCliente modalHistoricoGradeAbas" role="tablist" aria-label={titulo}>
            {abas.map((aba) => (
              <button
                key={aba.id}
                type="button"
                role="tab"
                className={`abaModalCliente ${abaAtiva === aba.id ? 'ativa' : ''}`}
                aria-selected={abaAtiva === aba.id}
                onClick={() => onSelecionarAba?.(aba.id)}
              >
                {aba.label}
              </button>
            ))}
          </div>
        ) : null}

        <div className="corpoModalCliente corpoModalClienteSemRolagem modalHistoricoGradeCorpo">
          {children}
        </div>
      </section>
    </div>
  );
}

function normalizarIdModal(valor) {
  return String(valor || '')
    .replace(/[^a-zA-Z0-9]+/g, '')
    .trim();
}