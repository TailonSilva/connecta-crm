import { useState } from 'react';
import { CabecalhoClientes } from './cabecalhoClientes';
import { CorpoClientes } from './corpoClientes';

export function PaginaClientes() {
  const [pesquisa, definirPesquisa] = useState('');

  return (
    <>
      <CabecalhoClientes
        pesquisa={pesquisa}
        aoAlterarPesquisa={definirPesquisa}
      />
      <CorpoClientes pesquisa={pesquisa} />
    </>
  );
}
