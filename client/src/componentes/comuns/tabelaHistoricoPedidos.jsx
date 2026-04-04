import { BotaoAcaoGrade } from './botaoAcaoGrade';
import { normalizarPreco } from '../../utilitarios/normalizarPreco';
import '../../recursos/estilos/modalHistoricoVendasCliente.css';

export function TabelaHistoricoPedidos({
  carregando,
  mensagemErro,
  pedidos = [],
  contextoSalvo = true,
  mensagemSemContexto = 'Nenhum contexto disponivel.',
  mensagemVazia = 'Nenhum pedido encontrado.',
  exibirCliente = false,
  exibirAcoes = true,
  onConsultarPedido
}) {
  return (
    <div className="gradeContatosModal gradePedidosCliente modalHistoricoVendasClienteGrade">
      <table className="tabelaContatosModal tabelaPedidosCliente">
        <thead>
          <tr>
            <th className="colunaHistoricoData">Inclusao</th>
            <th className="colunaHistoricoData">Entrega</th>
            <th className="colunaHistoricoPedido">Pedido</th>
            {exibirCliente ? <th className="colunaHistoricoCliente">Cliente</th> : null}
            <th className="colunaHistoricoEtapa">Etapa</th>
            <th className="colunaHistoricoVendedor">Vendedor</th>
            <th className="colunaHistoricoPrazoPagamento">Prazo de pagamento</th>
            <th className="colunaHistoricoValorTotal">Total</th>
            {exibirAcoes ? <th className="cabecalhoAcoesContato">Acoes</th> : null}
          </tr>
        </thead>
        <tbody>
          {carregando ? (
            <tr>
              <td colSpan={obterColspanPedidos({ exibirCliente, exibirAcoes })} className="mensagemTabelaContatosModal">Carregando pedidos...</td>
            </tr>
          ) : mensagemErro ? (
            <tr>
              <td colSpan={obterColspanPedidos({ exibirCliente, exibirAcoes })} className="mensagemTabelaContatosModal">{mensagemErro}</td>
            </tr>
          ) : !contextoSalvo ? (
            <tr>
              <td colSpan={obterColspanPedidos({ exibirCliente, exibirAcoes })} className="mensagemTabelaContatosModal">{mensagemSemContexto}</td>
            </tr>
          ) : pedidos.length > 0 ? (
            pedidos.map((pedido) => (
              <tr key={pedido.idPedido}>
                <td className="colunaHistoricoData">{formatarDataHistoricoVenda(pedido.dataInclusao)}</td>
                <td className="colunaHistoricoData">{formatarDataHistoricoVenda(pedido.dataEntrega)}</td>
                <td className="colunaHistoricoPedido">
                  <span className="codigoHistoricoPedido">{`#${String(pedido.idPedido).padStart(4, '0')}`}</span>
                </td>
                {exibirCliente ? <td className="colunaHistoricoCliente">{pedido.nomeClienteSnapshot || 'Cliente nao informado'}</td> : null}
                <td className="colunaHistoricoEtapa">{pedido.nomeEtapaPedidoSnapshot || 'Sem etapa'}</td>
                <td className="colunaHistoricoVendedor">{pedido.nomeVendedorSnapshot || 'Nao informado'}</td>
                <td className="colunaHistoricoPrazoPagamento">{pedido.nomePrazoPagamentoSnapshot || 'Nao informado'}</td>
                <td className="colunaHistoricoValorTotal">{normalizarPreco(pedido.totalPedido)}</td>
                {exibirAcoes ? (
                  <td>
                    <div className="acoesContatoModal">
                      <BotaoAcaoGrade icone="consultar" titulo="Consultar pedido" onClick={() => onConsultarPedido?.(pedido)} />
                    </div>
                  </td>
                ) : null}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={obterColspanPedidos({ exibirCliente, exibirAcoes })} className="mensagemTabelaContatosModal">{mensagemVazia}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function formatarDataHistoricoVenda(data) {
  if (!data) {
    return 'Nao informada';
  }

  return new Intl.DateTimeFormat('pt-BR').format(new Date(`${data}T00:00:00`));
}

function obterColspanPedidos({ exibirCliente, exibirAcoes }) {
  return 7 + (exibirCliente ? 1 : 0) + (exibirAcoes ? 1 : 0);
}