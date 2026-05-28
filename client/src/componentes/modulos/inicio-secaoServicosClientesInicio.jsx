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
        obterValorTexto={(item) => `${item.quantidadeContratados} sim`}
        obterValorPercentual={(item) => item.percentualContratados}
        obterQuantidadeTexto={(item) => `${item.quantidadeNaoContratados} nao | ${item.quantidadeNaoAplicavel} N/A | ${item.quantidadeTerceiro} terceiro`}
        obterQuantidadePercentual={(item) => item.percentualNaoOuNaoAplicavel}
        ariaAcao="Abrir lista completa de clientes por servico"
      />
    </div>
  );
}
