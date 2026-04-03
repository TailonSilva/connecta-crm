import { BotaoAcaoGrade } from '../../componentes/comuns/botaoAcaoGrade';
import { ModalHistoricoGrade } from '../../componentes/comuns/modalHistoricoGrade';
import { normalizarPreco } from '../../utilitarios/normalizarPreco';
import '../../recursos/estilos/modalHistoricoVendasCliente.css';

const abasVendasHistoricoCliente = [
  { id: 'pedidos', label: 'Pedidos' },
  { id: 'itens', label: 'Itens do pedido' }
];

export function ModalHistoricoVendasCliente({
  aberto,
  cliente,
  abaAtiva,
  onSelecionarAba,
  carregando,
  mensagemErro,
  pedidos,
  itensPedidos,
  filtrosAtivos,
  onFechar,
  onAbrirFiltros,
  onConsultarPedido
}) {
  return (
    <ModalHistoricoGrade
      aberto={aberto}
      titulo="Vendas do cliente"
      subtitulo={cliente?.nomeFantasia || cliente?.razaoSocial || 'Cliente nao salvo'}
      filtrosAtivos={filtrosAtivos}
      tituloFiltro="Filtrar pedidos"
      ariaFiltro="Filtrar pedidos"
      onAbrirFiltros={onAbrirFiltros}
      onFechar={onFechar}
      abas={abasVendasHistoricoCliente}
      abaAtiva={abaAtiva}
      onSelecionarAba={onSelecionarAba}
      abasNoCabecalho
    >
      <section className="painelContatosModalCliente painelPedidosCliente modalHistoricoVendasClientePainel">
        {abaAtiva === 'pedidos' ? (
          <div className="gradeContatosModal gradePedidosCliente modalHistoricoVendasClienteGrade">
            <table className="tabelaContatosModal tabelaPedidosCliente">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Pedido</th>
                  <th>Etapa</th>
                  <th>Vendedor</th>
                  <th>Total</th>
                  <th className="cabecalhoAcoesContato">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {carregando ? (
                  <tr>
                    <td colSpan={6} className="mensagemTabelaContatosModal">Carregando pedidos...</td>
                  </tr>
                ) : mensagemErro ? (
                  <tr>
                    <td colSpan={6} className="mensagemTabelaContatosModal">{mensagemErro}</td>
                  </tr>
                ) : !cliente?.idCliente ? (
                  <tr>
                    <td colSpan={6} className="mensagemTabelaContatosModal">Os pedidos ficarao disponiveis apos salvar o cliente.</td>
                  </tr>
                ) : pedidos.length > 0 ? (
                  pedidos.map((pedido) => (
                    <tr key={pedido.idPedido}>
                      <td>{formatarDataHistoricoCliente(pedido.dataInclusao)}</td>
                      <td>
                        <div className="celulaContatoModal">{`#${String(pedido.idPedido).padStart(4, '0')}`}</div>
                      </td>
                      <td>{pedido.nomeEtapaPedidoSnapshot || 'Sem etapa'}</td>
                      <td>{pedido.nomeVendedorSnapshot || 'Nao informado'}</td>
                      <td>{normalizarPreco(pedido.totalPedido)}</td>
                      <td>
                        <div className="acoesContatoModal">
                          <BotaoAcaoGrade icone="consultar" titulo="Consultar pedido" onClick={() => onConsultarPedido(pedido)} />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="mensagemTabelaContatosModal">Nenhum pedido encontrado com os filtros informados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="gradeContatosModal gradePedidosCliente modalHistoricoVendasClienteGrade">
            <table className="tabelaContatosModal tabelaItensPedidosCliente">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Pedido</th>
                  <th>Produto</th>
                  <th>Valor</th>
                  <th>Quantidade</th>
                  <th>Valor total</th>
                </tr>
              </thead>
              <tbody>
                {carregando ? (
                  <tr>
                    <td colSpan={6} className="mensagemTabelaContatosModal">Carregando itens dos pedidos...</td>
                  </tr>
                ) : mensagemErro ? (
                  <tr>
                    <td colSpan={6} className="mensagemTabelaContatosModal">{mensagemErro}</td>
                  </tr>
                ) : !cliente?.idCliente ? (
                  <tr>
                    <td colSpan={6} className="mensagemTabelaContatosModal">Os itens dos pedidos ficarao disponiveis apos salvar o cliente.</td>
                  </tr>
                ) : itensPedidos.length > 0 ? (
                  itensPedidos.map((item) => (
                    <tr key={item.chave}>
                      <td>{formatarDataHistoricoCliente(item.dataPedido)}</td>
                      <td>{`#${String(item.idPedido).padStart(4, '0')}`}</td>
                      <td>{item.descricaoProduto}</td>
                      <td>{normalizarPreco(item.valorUnitario)}</td>
                      <td>{item.quantidade}</td>
                      <td>{normalizarPreco(item.valorTotal)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="mensagemTabelaContatosModal">Nenhum item de pedido encontrado com os filtros informados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
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