import { exportarPdfDesktop } from '../../servicos/desktop';
import { normalizarPreco } from '../normalizarPreco';

export async function exportarRelatorioItensPedidosFechadosPdf({
  itens,
  chips,
  cards,
  usuarioLogado
}) {
  const html = gerarHtmlRelatorioItensPedidosFechados({
    itens,
    chips,
    cards,
    usuarioLogado
  });

  return exportarPdfDesktop({
    html,
    nomeArquivo: montarNomeArquivoRelatorio()
  });
}

function gerarHtmlRelatorioItensPedidosFechados({ itens, chips, cards, usuarioLogado }) {
  const geradoEm = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date());

  const resumoFiltros = Array.isArray(chips) && chips.length > 0
    ? chips.map((chip) => `<span class="relatorioItensVendasPdfChip">${escapeHtml(chip.rotulo)}</span>`).join('')
    : '<span class="relatorioItensVendasPdfChip">Sem filtros adicionais</span>';

  const cardsHtml = (Array.isArray(cards) ? cards : []).map((card) => `
    <article class="relatorioItensVendasPdfCard">
      <span>${escapeHtml(card.titulo)}</span>
      <strong>${escapeHtml(card.valor)}</strong>
    </article>
  `).join('');

  const linhasItens = (Array.isArray(itens) ? itens : []).map((item) => `
    <tr>
      <td>${escapeHtml(formatarData(item.dataInclusao))}</td>
      <td>${escapeHtml(formatarData(item.dataEntrega))}</td>
      <td>${escapeHtml(formatarCodigoPedido(item.idPedido))}</td>
      <td>${escapeHtml(item.nomeCliente || 'Cliente nao informado')}</td>
      <td>${escapeHtml(item.referenciaProduto || '-')}</td>
      <td>${escapeHtml(item.descricaoProduto || 'Produto nao informado')}</td>
      <td>${escapeHtml(item.nomeTipoPedido || 'Nao informado')}</td>
      <td>${escapeHtml(item.nomeVendedor || 'Nao informado')}</td>
      <td>${escapeHtml(normalizarPreco(item.valorUnitario || 0))}</td>
      <td>${escapeHtml(formatarQuantidade(item.quantidade))}</td>
      <td>${escapeHtml(normalizarPreco(item.valorTotal || 0))}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
  <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Relatorio de Itens de Vendas</title>
      <style>
        * { box-sizing: border-box; }
        html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        @page { size: A4 landscape; margin: 12mm; }
        body {
          margin: 0;
          padding: 28px;
          font-family: "Segoe UI", Arial, sans-serif;
          color: #163247;
          background: #f4f8fb;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .relatorioItensVendasPdf { display: grid; gap: 18px; }
        .relatorioItensVendasPdfHero {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 18px;
          padding: 22px;
          border-radius: 22px;
          background: linear-gradient(135deg, #0f5f94 0%, #1791e2 100%);
          color: #ffffff;
          break-inside: avoid;
        }
        .relatorioItensVendasPdfHeroPrincipal { display: grid; gap: 12px; min-width: 0; }
        .relatorioItensVendasPdfHero h1 { margin: 0; font-size: 27px; }
        .relatorioItensVendasPdfMeta {
          display: grid;
          justify-items: end;
          align-content: start;
          gap: 8px;
          min-width: 220px;
          font-size: 13px;
          text-align: right;
          opacity: 0.95;
        }
        .relatorioItensVendasPdfMetaItem { display: grid; gap: 2px; }
        .relatorioItensVendasPdfMetaItem strong {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          opacity: 0.82;
        }
        .relatorioItensVendasPdfMetaItem span { font-size: 14px; font-weight: 700; }
        .relatorioItensVendasPdfChips { display: flex; flex-wrap: wrap; gap: 8px; }
        .relatorioItensVendasPdfChip {
          display: inline-flex;
          align-items: center;
          min-height: 30px;
          padding: 6px 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.16);
          font-size: 12px;
          font-weight: 600;
        }
        .relatorioItensVendasPdfCards {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }
        .relatorioItensVendasPdfCard {
          display: grid;
          gap: 8px;
          padding: 16px;
          border-radius: 18px;
          background: #ffffff;
          border: 1px solid rgba(15, 95, 148, 0.12);
          break-inside: avoid;
        }
        .relatorioItensVendasPdfCard span {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #5f7890;
          font-weight: 700;
        }
        .relatorioItensVendasPdfCard strong { font-size: 23px; color: #0f5f94; }
        .relatorioItensVendasPdfTabela {
          width: 100%;
          border-collapse: collapse;
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          break-inside: auto;
        }
        .relatorioItensVendasPdfTabela th,
        .relatorioItensVendasPdfTabela td {
          padding: 10px 11px;
          border-bottom: 1px solid rgba(15, 95, 148, 0.08);
          text-align: left;
          font-size: 11px;
          vertical-align: top;
        }
        .relatorioItensVendasPdfTabela th {
          background: #eff6fb;
          color: #0f5f94;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .relatorioItensVendasPdfRodape {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          font-size: 12px;
          color: #5f7890;
        }
        @media print {
          body { padding: 0; background: #ffffff; }
        }
      </style>
    </head>
    <body>
      <div class="relatorioItensVendasPdf">
        <header class="relatorioItensVendasPdfHero">
          <div class="relatorioItensVendasPdfHeroPrincipal">
            <h1>Relatorio de Itens de Vendas</h1>
            <div class="relatorioItensVendasPdfChips">${resumoFiltros}</div>
          </div>
          <div class="relatorioItensVendasPdfMeta">
            <div class="relatorioItensVendasPdfMetaItem">
              <strong>Gerado em</strong>
              <span>${escapeHtml(geradoEm)}</span>
            </div>
            <div class="relatorioItensVendasPdfMetaItem">
              <strong>Usuario</strong>
              <span>${escapeHtml(usuarioLogado?.nome || 'Nao informado')}</span>
            </div>
          </div>
        </header>

        <section class="relatorioItensVendasPdfCards">${cardsHtml}</section>

        <table class="relatorioItensVendasPdfTabela">
          <thead>
            <tr>
              <th>Inclusao</th>
              <th>Entrega</th>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Referencia</th>
              <th>Descricao</th>
              <th>Tipo</th>
              <th>Vendedor</th>
              <th>Valor un</th>
              <th>Qtd</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>${linhasItens}</tbody>
        </table>

        <footer class="relatorioItensVendasPdfRodape">
          <span>Total de itens: ${escapeHtml(String((itens || []).length))}</span>
          <span>Connecta CRM</span>
        </footer>
      </div>
    </body>
  </html>`;
}

function montarNomeArquivoRelatorio() {
  const data = new Date();
  const dataFormatada = [
    data.getFullYear(),
    String(data.getMonth() + 1).padStart(2, '0'),
    String(data.getDate()).padStart(2, '0')
  ].join('-');

  return `Relatorio Itens de Vendas - ${dataFormatada}.pdf`;
}

function formatarData(valor) {
  if (!valor) {
    return 'Nao informada';
  }

  return new Intl.DateTimeFormat('pt-BR').format(new Date(`${valor}T00:00:00`));
}

function formatarCodigoPedido(idPedido) {
  return `#${String(idPedido || '').padStart(4, '0')}`;
}

function formatarQuantidade(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}

function escapeHtml(valor) {
  return String(valor || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
