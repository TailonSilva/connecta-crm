import { CorpoPagina } from '../../componentes/layout/corpoPagina';
import { ListaClientes } from './listaClientes';

export function CorpoClientes({
  empresa,
  clientes,
  carregando,
  mensagemErro,
  aoEditarCliente,
  aoConsultarCliente,
  aoInativarCliente
}) {
  return (
    <CorpoPagina>
      <div className="gradePainelClientes">
        <ListaClientes
          empresa={empresa}
          clientes={clientes}
          carregando={carregando}
          mensagemErro={mensagemErro}
          aoEditarCliente={aoEditarCliente}
          aoConsultarCliente={aoConsultarCliente}
          aoInativarCliente={aoInativarCliente}
        />
      </div>
    </CorpoPagina>
  );
}
