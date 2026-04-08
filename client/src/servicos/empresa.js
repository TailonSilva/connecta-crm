import { requisitarApi } from './api';
import { requisitarListaApi } from './listas';
import { buscarCep } from './clientes';
import { normalizarConfiguracoesColunasGridClientes } from '../utilitarios/colunasGridClientes';
import { normalizarConfiguracoesColunasGridOrcamentos } from '../utilitarios/colunasGridOrcamentos';
import { normalizarConfiguracoesColunasGridProdutos } from '../utilitarios/colunasGridProdutos';
import { normalizarConfiguracoesColunasGridPedidos } from '../utilitarios/colunasGridPedidos';
import { normalizarConfiguracoesColunasGridAtendimentos } from '../utilitarios/colunasGridAtendimentos';

export async function listarEmpresas(opcoes) {
  const empresas = await requisitarListaApi('/empresas', opcoes);

  return Array.isArray(empresas)
    ? empresas.map((empresa) => normalizarEmpresa(empresa))
    : [];
}

export function incluirEmpresa(payload) {
  return requisitarApi('/empresas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export function atualizarEmpresa(idEmpresa, payload) {
  return requisitarApi(`/empresas/${idEmpresa}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export function criarPayloadAtualizacaoColunasGrid(chave, colunas) {
  const normalizadores = {
    colunasGridClientes: normalizarConfiguracoesColunasGridClientes,
    colunasGridOrcamentos: normalizarConfiguracoesColunasGridOrcamentos,
    colunasGridProdutos: normalizarConfiguracoesColunasGridProdutos,
    colunasGridPedidos: normalizarConfiguracoesColunasGridPedidos,
    colunasGridAtendimentos: normalizarConfiguracoesColunasGridAtendimentos
  };

  const normalizar = normalizadores[chave];

  if (!normalizar) {
    throw new Error('Configuracao de grid invalida.');
  }

  return {
    [chave]: JSON.stringify(
      normalizar(colunas).map((coluna) => ({
        id: coluna.id,
        visivel: coluna.visivel !== false,
        ordem: coluna.ordem,
        span: coluna.span,
        rotulo: coluna.rotulo,
        base: coluna.base
      }))
    )
  };
}

export { buscarCep };

function normalizarEmpresa(empresa) {
  if (!empresa) {
    return empresa;
  }

  return {
    ...empresa,
    colunasGridClientes: normalizarConfiguracoesColunasGridClientes(empresa.colunasGridClientes),
    colunasGridOrcamentos: normalizarConfiguracoesColunasGridOrcamentos(empresa.colunasGridOrcamentos),
    colunasGridProdutos: normalizarConfiguracoesColunasGridProdutos(empresa.colunasGridProdutos),
    colunasGridPedidos: normalizarConfiguracoesColunasGridPedidos(empresa.colunasGridPedidos),
    colunasGridAtendimentos: normalizarConfiguracoesColunasGridAtendimentos(empresa.colunasGridAtendimentos),
    imagem: adicionarCacheBusterImagem(empresa.imagem)
  };
}

function adicionarCacheBusterImagem(valorImagem) {
  if (typeof valorImagem !== 'string') {
    return '';
  }

  const imagem = valorImagem.trim();

  if (!imagem || !/^https?:\/\//i.test(imagem)) {
    return imagem;
  }

  try {
    const url = new URL(imagem);
    url.searchParams.set('v', Date.now().toString());
    return url.toString();
  } catch (_erro) {
    return imagem;
  }
}
