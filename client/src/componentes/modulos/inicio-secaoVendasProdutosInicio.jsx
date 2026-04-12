import { SecaoResumoRelacionamentoComModalInicio } from './inicio-secaoResumoRelacionamentoComModalInicio';
import '../../recursos/estilos/secaoVendasProdutosInicio.css';

export function SecaoVendasProdutosInicio({ itens, titulo = 'Vendas do mes por produto' }) {
  return (
    <div className="secaoVendasProdutosInicioEscopo">
      <SecaoResumoRelacionamentoComModalInicio
        titulo={titulo}
        composicao="Valor liquido e quantidade de itens por produto."
        periodo="Mes corrente pela data de entrada do pedido."
        itens={itens}
        colunasPainel={2}
        mensagemVazia="Nenhuma venda registrada no mes atual para produtos."
        modalTitulo={titulo}
        modalSubtitulo="Lista completa de produtos vendidos no mes corrente."
        ariaAcao="Abrir lista completa de produtos vendidos no mes"
      />
    </div>
  );
}

