import { requisitarApi } from './api';
import { requisitarListaApi } from './listas';
import { montarParametrosConsulta } from '../utilitarios/montarParametrosConsulta';

export function listarServicos(parametros) {
  return requisitarListaApi(`/servicos${montarParametrosConsulta(parametros)}`, {
    incluirInativos: Boolean(parametros?.incluirInativos)
  });
}

export function incluirServico(payload) {
  return requisitarApi('/servicos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export function atualizarServico(idServico, payload) {
  return requisitarApi(`/servicos/${idServico}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}
