import { Botao } from '../comuns/botao';

const opcoesSituacaoServico = [
  { valor: 'contratado', label: 'Sim' },
  { valor: 'naoContratado', label: 'Nao' },
  { valor: 'naoAplicavel', label: 'N/A' },
  { valor: 'terceiro', label: 'Terceiro' }
];

export function ModalEdicaoServicosCliente({
  aberto,
  cliente,
  servicos,
  formulario,
  salvando,
  mensagemErro,
  aoAlterarServico,
  aoFechar,
  aoSalvar
}) {
  if (!aberto) {
    return null;
  }

  return (
    <div className="camadaModalContato" role="presentation" onMouseDown={aoFechar}>
      <div
        className="modalCliente modalEdicaoServicosCliente"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tituloModalEdicaoServicosCliente"
        onMouseDown={(evento) => evento.stopPropagation()}
      >
        <header className="cabecalhoModalCliente">
          <div>
            <h2 id="tituloModalEdicaoServicosCliente">Editar servicos do cliente</h2>
            <p className="descricaoSecaoModalCliente">{cliente?.nomeFantasia || 'Cliente nao informado'}</p>
          </div>

          <div className="acoesCabecalhoModalCliente">
            <Botao variante="secundario" type="button" onClick={aoFechar} disabled={salvando}>
              Cancelar
            </Botao>
            <Botao variante="primario" type="button" onClick={aoSalvar} disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar'}
            </Botao>
          </div>
        </header>

        <div className="corpoModalCliente">
          {mensagemErro ? (
            <div className="mensagemErroModalServicosCliente" role="alert">
              {mensagemErro}
            </div>
          ) : null}

          <div className="gradeEdicaoServicosCliente">
            <div className="linhaCabecalhoEdicaoServicosCliente">
              <span>Servico</span>
              <span>Contratado</span>
              <span>Observacao</span>
            </div>

            {(servicos || []).map((servico) => {
              const item = (formulario || []).find((registro) => String(registro.idServico) === String(servico.idServico)) || {};

              return (
                <div className="linhaEdicaoServicosCliente" key={servico.idServico}>
                  <div className="celulaServicoEdicaoCliente">
                    <strong>{servico.descricao || `Servico #${servico.idServico}`}</strong>
                    <span>{String(servico.idServico).padStart(4, '0')}</span>
                  </div>

                  <div className="campoFormulario">
                    <select
                      id={`situacaoServicoCliente${servico.idServico}`}
                      className="entradaFormulario"
                      value={item.situacao || 'naoContratado'}
                      onChange={(evento) => aoAlterarServico(servico.idServico, 'situacao', evento.target.value)}
                      disabled={salvando}
                      aria-label={`Contratado - ${servico.descricao || `Servico #${servico.idServico}`}`}
                    >
                      {opcoesSituacaoServico.map((opcao) => (
                        <option key={opcao.valor} value={opcao.valor}>
                          {opcao.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="campoFormulario">
                    <input
                      id={`observacaoServicoCliente${servico.idServico}`}
                      className="entradaFormulario"
                      type="text"
                      value={item.observacao || ''}
                      onChange={(evento) => aoAlterarServico(servico.idServico, 'observacao', evento.target.value)}
                      placeholder="Observacao do servico"
                      disabled={salvando}
                      aria-label={`Observacao - ${servico.descricao || `Servico #${servico.idServico}`}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
