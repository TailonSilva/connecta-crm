import { CabecalhoPadrao } from '../componentes/modulos/padrao-cabecalhoPadrao';
import { CorpoPadrao } from '../componentes/modulos/padrao-corpoPadrao';

export function PaginaPadrao({ pagina }) {
  return (
    <>
      <CabecalhoPadrao titulo={pagina.titulo} descricao={pagina.descricao} />
      <CorpoPadrao pagina={pagina} />
    </>
  );
}

