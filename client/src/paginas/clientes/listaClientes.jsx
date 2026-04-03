import { GradePadrao } from '../../componentes/comuns/gradePadrao';
import { CabecalhoGradeClientes } from './cabecalhoGradeClientes';
import { LinhaCliente } from './linhaCliente';

export function ListaClientes({
  empresa,
  clientes,
  carregando,
  mensagemErro,
  aoEditarCliente,
  aoConsultarCliente,
  aoInativarCliente
}) {
  return (
    <GradePadrao
      cabecalho={<CabecalhoGradeClientes />}
      carregando={carregando}
      mensagemErro={mensagemErro}
      temItens={clientes.length > 0}
      mensagemCarregando="Carregando clientes..."
      mensagemVazia="Nenhum cliente encontrado."
    >
      {clientes.map((cliente) => (
        <LinhaCliente
          key={cliente.idCliente}
          empresa={empresa}
          cliente={cliente}
          aoConsultar={() => aoConsultarCliente(cliente)}
          aoEditar={() => aoEditarCliente(cliente)}
          aoInativar={() => aoInativarCliente(cliente)}
        />
      ))}
    </GradePadrao>
  );
}
