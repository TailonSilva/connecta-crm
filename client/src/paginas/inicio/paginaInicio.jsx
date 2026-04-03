import '../../recursos/estilos/paginaInicio.css';
import { CorpoPagina } from '../../componentes/layout/corpoPagina';
import { CabecalhoInicio } from './componentes/cabecalhoInicio';

export function PaginaInicio() {
  return (
    <>
      <CabecalhoInicio somenteTitulo />
      <CorpoPagina />
    </>
  );
}
