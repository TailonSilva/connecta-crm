import { normalizarPreco } from '../../utilitarios/normalizarPreco';

export function TabelaHistoricoOrcamentos({
  carregando = false,
  mensagemErro = '',
  orcamentos = [],
  contextoSalvo = true,
  mensagemSemContexto = 'Os orcamentos ficarao disponiveis apos carregar os registros.',
  mensagemVazia = 'Nenhum orcamento encontrado para o periodo informado.'
}) {
  return (
    <div className="gradeContatosModal modalHistoricoOrcamentosGrade">
      <table className="tabelaContatosModal tabelaHistoricoOrcamentos">
        <thead>
          <tr>
            <th className="colunaHistoricoOrcamentoData">Inclusao</th>
            <th className="colunaHistoricoOrcamentoData">Fechamento</th>
            <th className="colunaHistoricoOrcamentoCodigo">Codigo</th>
            <th className="colunaHistoricoOrcamentoCliente">Cliente</th>
            <th className="colunaHistoricoOrcamentoContato">Contato</th>
            <th className="colunaHistoricoOrcamentoEtapa">Etapa</th>
            <th className="colunaHistoricoOrcamentoVendedor">Vendedor</th>
            <th className="colunaHistoricoOrcamentoTotal">Total</th>
          </tr>
        </thead>
        <tbody>
          {carregando ? (
            <tr>
              <td colSpan={8} className="mensagemTabelaContatosModal">Carregando orcamentos...</td>
            </tr>
          ) : mensagemErro ? (
            <tr>
              <td colSpan={8} className="mensagemTabelaContatosModal">{mensagemErro}</td>
            </tr>
          ) : !contextoSalvo ? (
            <tr>
              <td colSpan={8} className="mensagemTabelaContatosModal">{mensagemSemContexto}</td>
            </tr>
          ) : orcamentos.length > 0 ? (
            orcamentos.map((orcamento) => (
              <tr key={orcamento.idOrcamento}>
                <td className="colunaHistoricoOrcamentoData">{formatarDataTabela(orcamento.dataInclusao, 'Nao informada')}</td>
                <td className="colunaHistoricoOrcamentoData">{formatarDataTabela(orcamento.dataFechamento, '')}</td>
                <td className="colunaHistoricoOrcamentoCodigo">{`#${String(orcamento.idOrcamento).padStart(4, '0')}`}</td>
                <td className="colunaHistoricoOrcamentoCliente">{orcamento.nomeCliente || 'Nao informado'}</td>
                <td className="colunaHistoricoOrcamentoContato">{orcamento.nomeContato || ''}</td>
                <td className="colunaHistoricoOrcamentoEtapa">{orcamento.nomeEtapaOrcamento || 'Sem etapa'}</td>
                <td className="colunaHistoricoOrcamentoVendedor">{orcamento.nomeVendedor || 'Nao informado'}</td>
                <td className="colunaHistoricoOrcamentoTotal">{normalizarPreco(orcamento.totalOrcamento || 0)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="mensagemTabelaContatosModal">{mensagemVazia}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function formatarDataTabela(valor, fallback = '') {
  if (!valor) {
    return fallback;
  }

  return new Intl.DateTimeFormat('pt-BR').format(new Date(`${valor}T00:00:00`));
}