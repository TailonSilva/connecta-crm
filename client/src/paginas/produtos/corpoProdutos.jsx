import { CorpoPagina } from '../../componentes/layout/corpoPagina';
import { ListaProdutos } from './listaProdutos';

export function CorpoProdutos({
  produtos,
  carregando,
  mensagemErro,
  aoConsultarProduto,
  aoEditarProduto,
  aoInativarProduto,
  somenteConsulta = false
}) {
  return (
    <CorpoPagina>
      <div className="gradePainelProdutos">
        <ListaProdutos
          produtos={produtos}
          carregando={carregando}
          mensagemErro={mensagemErro}
          aoConsultarProduto={aoConsultarProduto}
          aoEditarProduto={aoEditarProduto}
          aoInativarProduto={aoInativarProduto}
          somenteConsulta={somenteConsulta}
        />
      </div>
    </CorpoPagina>
  );
}
