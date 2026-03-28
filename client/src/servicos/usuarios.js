import { requisitarApi } from './api';

export function listarUsuarios() {
  return requisitarApi('/usuarios');
}

export function incluirUsuario(payload) {
  return requisitarApi('/usuarios', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export function atualizarUsuario(idUsuario, payload) {
  return requisitarApi(`/usuarios/${idUsuario}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}
