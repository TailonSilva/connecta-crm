import { BotaoAcaoGrade } from '../../componentes/comuns/botaoAcaoGrade';
import { ModalHistoricoGrade } from '../../componentes/comuns/modalHistoricoGrade';
import '../../recursos/estilos/modalHistoricoAtendimentosCliente.css';

export function ModalHistoricoAtendimentosCliente({
  aberto,
  cliente,
  carregando,
  mensagemErro,
  atendimentos,
  filtrosAtivos,
  onFechar,
  onAbrirFiltros,
  onConsultarAtendimento
}) {
  return (
    <ModalHistoricoGrade
      aberto={aberto}
      titulo="Atendimentos do cliente"
      subtitulo={cliente?.nomeFantasia || cliente?.razaoSocial || 'Cliente nao salvo'}
      filtrosAtivos={filtrosAtivos}
      tituloFiltro="Filtrar atendimentos"
      ariaFiltro="Filtrar atendimentos"
      onAbrirFiltros={onAbrirFiltros}
      onFechar={onFechar}
    >
      <section className="painelContatosModalCliente modalHistoricoAtendimentosClientePainel">
        <div className="gradeContatosModal gradeAtendimentosCliente modalHistoricoAtendimentosClienteGrade">
          <table className="tabelaContatosModal tabelaAtendimentosCliente">
            <thead>
              <tr>
                <th>Data</th>
                <th>Assunto</th>
                <th>Canal</th>
                <th>Usuario</th>
                <th className="cabecalhoAcoesContato">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {carregando ? (
                <tr>
                  <td colSpan={5} className="mensagemTabelaContatosModal">Carregando atendimentos...</td>
                </tr>
              ) : mensagemErro ? (
                <tr>
                  <td colSpan={5} className="mensagemTabelaContatosModal">{mensagemErro}</td>
                </tr>
              ) : !cliente?.idCliente ? (
                <tr>
                  <td colSpan={5} className="mensagemTabelaContatosModal">Os atendimentos ficarao disponiveis apos salvar o cliente.</td>
                </tr>
              ) : atendimentos.length > 0 ? (
                atendimentos.map((atendimento) => (
                  <tr key={atendimento.idAtendimento}>
                    <td>{formatarDataHistoricoCliente(atendimento.data)}</td>
                    <td>
                      <div className="celulaContatoModal">
                        <strong>{atendimento.assunto}</strong>
                        <span>{atendimento.nomeContato || atendimento.descricao || 'Sem detalhes adicionais'}</span>
                      </div>
                    </td>
                    <td>{atendimento.nomeCanalAtendimento}</td>
                    <td>{atendimento.nomeUsuario}</td>
                    <td>
                      <div className="acoesContatoModal">
                        <BotaoAcaoGrade icone="consultar" titulo="Consultar atendimento" onClick={() => onConsultarAtendimento(atendimento)} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="mensagemTabelaContatosModal">Nenhum atendimento encontrado com os filtros informados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </ModalHistoricoGrade>
  );
}

function formatarDataHistoricoCliente(data) {
  if (!data) {
    return 'Nao informada';
  }

  return new Intl.DateTimeFormat('pt-BR').format(new Date(`${data}T00:00:00`));
}