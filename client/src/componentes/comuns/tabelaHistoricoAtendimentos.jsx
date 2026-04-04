import { BotaoAcaoGrade } from './botaoAcaoGrade';
import '../../recursos/estilos/modalHistoricoAtendimentosCliente.css';

export function TabelaHistoricoAtendimentos({
  carregando = false,
  mensagemErro = '',
  atendimentos = [],
  contextoSalvo = true,
  mensagemSemContexto = 'Os atendimentos ficarao disponiveis apos salvar o cliente.',
  mensagemVazia = 'Nenhum atendimento encontrado com os filtros informados.',
  exibirCliente = false,
  exibirAcoes = false,
  onConsultarAtendimento
}) {
  return (
    <div className="gradeContatosModal gradeAtendimentosCliente modalHistoricoAtendimentosClienteGrade">
      <table className="tabelaContatosModal tabelaAtendimentosCliente">
        <thead>
          <tr>
            <th className="colunaHistoricoAtendimentoData">Data</th>
            <th className="colunaHistoricoAtendimentoHora">Inicio</th>
            <th className="colunaHistoricoAtendimentoHora">Fim</th>
            {exibirCliente ? <th className="colunaHistoricoAtendimentoCliente">Cliente</th> : null}
            <th className="colunaHistoricoAtendimentoAssunto">Assunto</th>
            <th className="colunaHistoricoAtendimentoContato">Contato</th>
            <th className="colunaHistoricoAtendimentoCanal">Canal</th>
            <th className="colunaHistoricoAtendimentoUsuario">Usuario</th>
            {exibirAcoes ? <th className="cabecalhoAcoesContato">Acoes</th> : null}
          </tr>
        </thead>
        <tbody>
          {carregando ? (
            <tr>
              <td colSpan={obterColspanAtendimentos({ exibirCliente, exibirAcoes })} className="mensagemTabelaContatosModal">Carregando atendimentos...</td>
            </tr>
          ) : mensagemErro ? (
            <tr>
              <td colSpan={obterColspanAtendimentos({ exibirCliente, exibirAcoes })} className="mensagemTabelaContatosModal">{mensagemErro}</td>
            </tr>
          ) : !contextoSalvo ? (
            <tr>
              <td colSpan={obterColspanAtendimentos({ exibirCliente, exibirAcoes })} className="mensagemTabelaContatosModal">{mensagemSemContexto}</td>
            </tr>
          ) : atendimentos.length > 0 ? (
            atendimentos.map((atendimento) => (
              <tr key={atendimento.idAtendimento}>
                <td className="colunaHistoricoAtendimentoData">{formatarDataHistorico(atendimento.data)}</td>
                <td className="colunaHistoricoAtendimentoHora">{formatarHoraHistorico(atendimento.horaInicio)}</td>
                <td className="colunaHistoricoAtendimentoHora">{formatarHoraHistorico(atendimento.horaFim)}</td>
                {exibirCliente ? <td className="colunaHistoricoAtendimentoCliente">{atendimento.nomeCliente || 'Cliente nao informado'}</td> : null}
                <td className="colunaHistoricoAtendimentoAssunto">{atendimento.assunto || 'Sem assunto'}</td>
                <td className="colunaHistoricoAtendimentoContato">{atendimento.nomeContato || 'Contato nao informado'}</td>
                <td className="colunaHistoricoAtendimentoCanal">{atendimento.nomeCanalAtendimento || 'Nao informado'}</td>
                <td className="colunaHistoricoAtendimentoUsuario">{atendimento.nomeUsuario || 'Nao informado'}</td>
                {exibirAcoes ? (
                  <td>
                    <div className="acoesContatoModal">
                      <BotaoAcaoGrade icone="consultar" titulo="Consultar atendimento" onClick={() => onConsultarAtendimento?.(atendimento)} />
                    </div>
                  </td>
                ) : null}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={obterColspanAtendimentos({ exibirCliente, exibirAcoes })} className="mensagemTabelaContatosModal">{mensagemVazia}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function obterColspanAtendimentos({ exibirCliente, exibirAcoes }) {
  return 7 + (exibirCliente ? 1 : 0) + (exibirAcoes ? 1 : 0);
}

function formatarDataHistorico(data) {
  if (!data) {
    return 'Nao informada';
  }

  return new Intl.DateTimeFormat('pt-BR').format(new Date(`${data}T00:00:00`));
}

function formatarHoraHistorico(hora) {
  return hora || '--:--';
}