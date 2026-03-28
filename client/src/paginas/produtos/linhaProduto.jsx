import { AcoesRegistro } from '../../componentes/comuns/acoesRegistro';
import { normalizarPreco } from '../../utilitarios/normalizarPreco';
import { DetalhesProduto } from './detalhesProduto';
import { ImagemProduto } from './imagemProduto';

export function LinhaProduto({
  produto,
  aoConsultar,
  aoEditar,
  aoInativar,
  somenteConsulta = false
}) {
  return (
    <tr className="linhaProduto">
      <td><ImagemProduto produto={produto} /></td>
      <td><DetalhesProduto produto={produto} /></td>
      <td>{produto.nomeGrupo}</td>
      <td>{produto.nomeMarca}</td>
      <td>{produto.nomeUnidade}</td>
      <td>{normalizarPreco(produto.preco)}</td>
      <td>
        <span className={`etiquetaStatus ${produto.status ? 'ativo' : 'inativo'}`}>
          {produto.status ? 'Ativo' : 'Inativo'}
        </span>
      </td>
      <td>
        <AcoesRegistro
          rotuloConsulta="Consultar produto"
          rotuloEdicao="Editar produto"
          rotuloInativacao="Inativar produto"
          exibirEdicao={!somenteConsulta}
          exibirInativacao={!somenteConsulta}
          aoConsultar={aoConsultar}
          aoEditar={aoEditar}
          aoInativar={aoInativar}
        />
      </td>
    </tr>
  );
}
