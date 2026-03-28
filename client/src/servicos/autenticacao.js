import { requisitarApi } from './api';

const chaveSessao = 'crm.usuarioLogado';

export function autenticarUsuario(usuario, senha) {
  return requisitarApi('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ usuario, senha })
  });
}

export function salvarSessaoUsuario(usuario) {
  localStorage.setItem(chaveSessao, JSON.stringify(usuario));
}

export function obterSessaoUsuario() {
  const valor = localStorage.getItem(chaveSessao);

  if (!valor) {
    return null;
  }

  try {
    return JSON.parse(valor);
  } catch (_erro) {
    localStorage.removeItem(chaveSessao);
    return null;
  }
}

export function limparSessaoUsuario() {
  localStorage.removeItem(chaveSessao);
}
