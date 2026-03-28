import { requisitarApi } from './api';

export function listarProdutos() {
  return requisitarApi('/produtos');
}

export function incluirProduto(payload) {
  return requisitarApi('/produtos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export function atualizarProduto(idProduto, payload) {
  return requisitarApi(`/produtos/${idProduto}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export function listarGruposProduto() {
  return requisitarApi('/gruposProduto');
}

export function listarMarcas() {
  return requisitarApi('/marcas');
}

export function listarUnidadesMedida() {
  return requisitarApi('/unidadesMedida');
}
