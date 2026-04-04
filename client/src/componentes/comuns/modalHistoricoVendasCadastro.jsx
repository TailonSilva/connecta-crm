import { ModalHistoricoGrade } from './modalHistoricoGrade';
import { TabelaHistoricoPedidos } from './tabelaHistoricoPedidos';
import { normalizarPreco } from '../../utilitarios/normalizarPreco';
import '../../recursos/estilos/modalHistoricoVendasCliente.css';

export function ModalHistoricoVendasCadastro({
  aberto,
  titulo,
  subtitulo,
  filtrosAtivos,
  tituloFiltro,
  ariaFiltro,
  valorPesquisa = '',
  onAlterarPesquisa,
  placeholderPesquisa = 'Pesquisar em vendas...',
  onAbrirFiltros,
  onFechar,
  abas = [],
  abaAtiva = '',
  onSelecionarAba,
  abasNoCabecalho = false,
  carregando,
  mensagemErro,
  pedidos = [],
  itensPedidos = [],
  exibirPedidos = true,
  contextoSalvo = true,
  mensagemSemContextoPedidos,
  mensagemSemContextoItens,
  mensagemVazioPedidos,
  mensagemVazioItens,
  exibirClienteNosPedidos = false,
  exibirClienteNosItens = false,
  exibirProdutoNosItens = false,
  exibirAcoesPedidos = true,
  exibirAcaoItens = false,
  onConsultarPedido
}) {
  const exibirAbas = exibirPedidos && Array.isArray(abas) && abas.length > 0;
  const exibindoPedidos = exibirPedidos && (!exibirAbas || abaAtiva === 'pedidos');

  return (
    <ModalHistoricoGrade
      aberto={aberto}
      titulo={titulo}
      subtitulo={subtitulo}
      className="modalHistoricoVendasCadastro"
      filtrosAtivos={filtrosAtivos}
      tituloFiltro={tituloFiltro}
      ariaFiltro={ariaFiltro}
      valorPesquisa={valorPesquisa}
      onAlterarPesquisa={onAlterarPesquisa}
      placeholderPesquisa={placeholderPesquisa}
      onAbrirFiltros={onAbrirFiltros}
      onFechar={onFechar}
      abas={exibirAbas ? abas : []}
      abaAtiva={abaAtiva}
      onSelecionarAba={onSelecionarAba}
      abasNoCabecalho={exibirAbas && abasNoCabecalho}
    >
      <section className="painelContatosModalCliente painelPedidosCliente modalHistoricoVendasClientePainel">
        {exibindoPedidos ? (
          <TabelaHistoricoPedidos
            carregando={carregando}
            mensagemErro={mensagemErro}
            pedidos={pedidos}
            contextoSalvo={contextoSalvo}
            mensagemSemContexto={mensagemSemContextoPedidos}
            mensagemVazia={mensagemVazioPedidos}
            exibirCliente={exibirClienteNosPedidos}
            exibirAcoes={exibirAcoesPedidos}
            onConsultarPedido={onConsultarPedido}
          />
        ) : (
          <div className="gradeContatosModal gradePedidosCliente modalHistoricoVendasClienteGrade">
            <table className="tabelaContatosModal tabelaItensPedidosCliente">
              <thead>
                <tr>
                  <th className="colunaHistoricoData">Inclusao</th>
                  <th className="colunaHistoricoData">Entrega</th>
                  <th className="colunaHistoricoPedido">Pedido</th>
                  {exibirClienteNosItens ? <th className="colunaHistoricoCliente">Cliente</th> : null}
                  {exibirProdutoNosItens ? <th className="colunaHistoricoReferencia">Referencia</th> : null}
                  {exibirProdutoNosItens ? <th className="colunaHistoricoDescricao">Descricao</th> : null}
                  <th className="colunaHistoricoValor">Valor</th>
                  <th className="colunaHistoricoQuantidade">Quantidade</th>
                  <th className="colunaHistoricoValorTotal">Valor total</th>
                  {exibirAcaoItens ? <th className="cabecalhoAcoesContato">Acoes</th> : null}
                </tr>
              </thead>
              <tbody>
                {carregando ? (
                  <tr>
                    <td colSpan={obterColspanItens({ exibirClienteNosItens, exibirProdutoNosItens, exibirAcaoItens })} className="mensagemTabelaContatosModal">Carregando itens dos pedidos...</td>
                  </tr>
                ) : mensagemErro ? (
                  <tr>
                    <td colSpan={obterColspanItens({ exibirClienteNosItens, exibirProdutoNosItens, exibirAcaoItens })} className="mensagemTabelaContatosModal">{mensagemErro}</td>
                  </tr>
                ) : !contextoSalvo ? (
                  <tr>
                    <td colSpan={obterColspanItens({ exibirClienteNosItens, exibirProdutoNosItens, exibirAcaoItens })} className="mensagemTabelaContatosModal">{mensagemSemContextoItens}</td>
                  </tr>
                ) : itensPedidos.length > 0 ? (
                  itensPedidos.map((item) => (
                    <tr key={item.chave}>
                      <td className="colunaHistoricoData">{formatarDataHistoricoVenda(item.dataInclusao)}</td>
                      <td className="colunaHistoricoData">{formatarDataHistoricoVenda(item.dataEntrega)}</td>
                      <td className="colunaHistoricoPedido">
                        <span className="codigoHistoricoPedido">{`#${String(item.idPedido).padStart(4, '0')}`}</span>
                      </td>
                      {exibirClienteNosItens ? <td className="colunaHistoricoCliente">{item.nomeCliente || 'Cliente nao informado'}</td> : null}
                      {exibirProdutoNosItens ? <td className="colunaHistoricoReferencia">{item.referenciaProduto || '-'}</td> : null}
                      {exibirProdutoNosItens ? <td className="colunaHistoricoDescricao">{item.descricaoProduto || 'Produto nao informado'}</td> : null}
                      <td className="colunaHistoricoValor">{normalizarPreco(item.valorUnitario)}</td>
                      <td className="colunaHistoricoQuantidade">{item.quantidade}</td>
                      <td className="colunaHistoricoValorTotal">{normalizarPreco(item.valorTotal)}</td>
                      {exibirAcaoItens ? (
                        <td>
                          <div className="acoesContatoModal">
                            <BotaoAcaoGrade icone="consultar" titulo="Consultar pedido" onClick={() => onConsultarPedido?.(item.pedido)} />
                          </div>
                        </td>
                      ) : null}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={obterColspanItens({ exibirClienteNosItens, exibirProdutoNosItens, exibirAcaoItens })} className="mensagemTabelaContatosModal">{mensagemVazioItens}</td>
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

function formatarDataHistoricoVenda(data) {
  if (!data) {
    return 'Nao informada';
  }

  return new Intl.DateTimeFormat('pt-BR').format(new Date(`${data}T00:00:00`));
}

function obterColspanItens({ exibirClienteNosItens, exibirProdutoNosItens, exibirAcaoItens }) {
  return 6 + (exibirClienteNosItens ? 1 : 0) + (exibirProdutoNosItens ? 2 : 0) + (exibirAcaoItens ? 1 : 0);
}
