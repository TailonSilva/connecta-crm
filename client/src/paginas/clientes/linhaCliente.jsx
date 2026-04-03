import { AvatarCliente } from './avatarCliente';
import { AcoesRegistro } from '../../componentes/comuns/acoesRegistro';
import { ContatoPrincipalCliente } from './contatoPrincipalCliente';
import { DetalhesCliente } from './detalhesCliente';

export function LinhaCliente({ empresa, cliente, aoConsultar, aoEditar, aoInativar }) {
  return (
    <tr className="linhaCliente">
      <td><AvatarCliente cliente={cliente} /></td>
      <td><DetalhesCliente cliente={cliente} empresa={empresa} /></td>
      <td>{cliente.cidade}</td>
      <td>{cliente.estado || 'Nao informado'}</td>
      <td><ContatoPrincipalCliente cliente={cliente} /></td>
      <td>{cliente.nomeVendedor}</td>
      <td>
        <span className={`etiquetaStatus ${cliente.status ? 'ativo' : 'inativo'}`}>
          {cliente.status ? 'Ativo' : 'Inativo'}
        </span>
      </td>
      <td>
        <AcoesRegistro
          rotuloConsulta="Consultar cliente"
          rotuloEdicao="Editar cliente"
          rotuloInativacao="Inativar cliente"
          aoConsultar={aoConsultar}
          aoEditar={aoEditar}
          aoInativar={aoInativar}
        />
      </td>
    </tr>
  );
}
