import { CorpoPagina } from '../layout/corpoPagina';
import { ListaProdutos } from './produtos-listaProdutos';

export function CorpoProdutos({
  empresa,
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
          empresa={empresa}
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

