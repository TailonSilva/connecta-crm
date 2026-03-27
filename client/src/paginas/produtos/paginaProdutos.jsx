import { useState } from 'react';
import { CabecalhoProdutos } from './cabecalhoProdutos';
import { CorpoProdutos } from './corpoProdutos';

export function PaginaProdutos() {
  const [pesquisa, definirPesquisa] = useState('');

  return (
    <>
      <CabecalhoProdutos
        pesquisa={pesquisa}
        aoAlterarPesquisa={definirPesquisa}
      />
      <CorpoProdutos pesquisa={pesquisa} />
    </>
  );
}
