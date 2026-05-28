import { SecaoResumoRelacionamentoComModalInicio } from './inicio-secaoResumoRelacionamentoComModalInicio';
import '../../recursos/estilos/secaoServicosClientesInicio.css';

export function SecaoServicosClientesInicio({ itens, titulo = 'Servicos Contratados' }) {
  return (
    <div className="secaoServicosClientesInicioEscopo">
      <SecaoResumoRelacionamentoComModalInicio
        titulo={titulo}
        itens={itens}
        composicao="Quantidade de clientes por situacao de cada servico cadastrado."
        periodo="Base cadastral atual da carteira ativa."
        mensagemVazia="Nenhum servico cadastrado para comparar clientes."
        modalTitulo={titulo}
        modalSubtitulo="Lista completa de clientes por situacao de servico."
        colunasPainel={2}
        tituloValor="Sim"
        tituloQuantidade="Nao / N/A / Terceiro"
        obterValorTexto={(item) => `${item.quantidadeContratados} sim (${formatarPercentualServico(item.percentualContratados)})`}
        obterValorPercentual={(item) => item.percentualContratados}
        obterQuantidadeTexto={(item) => `${item.quantidadeNaoContratados} nao (${formatarPercentualServico(item.percentualNaoContratados)}) | ${item.quantidadeNaoAplicavel} N/A (${formatarPercentualServico(item.percentualNaoAplicavel)}) | ${item.quantidadeTerceiro} terceiro (${formatarPercentualServico(item.percentualTerceiro)})`}
        obterQuantidadePercentual={(item) => item.percentualNaoOuNaoAplicavel}
        ariaAcao="Abrir lista completa de clientes por servico"
      />
    </div>
  );
}

function formatarPercentualServico(valor) {
  const numero = Number(valor);
  const percentual = Number.isFinite(numero) ? numero : 0;

  return `${percentual.toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  })}%`;
}
