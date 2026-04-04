import { requisitarApi } from './api';

const chaveSessao = 'crm.usuarioLogado';
const prefixoImagemApi = 'http://127.0.0.1:3001/api/arquivos/';

export async function autenticarUsuario(usuario, senha) {
  const usuarioAutenticado = await requisitarApi('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ usuario, senha })
  });

  return normalizarUsuarioSessao(usuarioAutenticado);
}

export function salvarSessaoUsuario(usuario) {
  const storage = obterStorageSessao();

  if (!storage) {
    return;
  }

  storage.setItem(chaveSessao, JSON.stringify(normalizarUsuarioSessao(usuario)));
  limparSessaoPersistidaLegada();
}

export function obterSessaoUsuario() {
  const storage = obterStorageSessao();

  if (!storage) {
    return null;
  }

  const valor = storage.getItem(chaveSessao);

  if (!valor) {
    limparSessaoPersistidaLegada();
    return null;
  }

  try {
    return normalizarUsuarioSessao(JSON.parse(valor));
  } catch (_erro) {
    storage.removeItem(chaveSessao);
    limparSessaoPersistidaLegada();
    return null;
  }
}

export function limparSessaoUsuario() {
  const storage = obterStorageSessao();

  storage?.removeItem(chaveSessao);
  limparSessaoPersistidaLegada();
}

function obterStorageSessao() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.sessionStorage;
  } catch (_erro) {
    return null;
  }
}

function limparSessaoPersistidaLegada() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(chaveSessao);
  } catch (_erro) {
    return;
  }
}

function normalizarUsuarioSessao(usuario) {
  if (!usuario) {
    return null;
  }

  return {
    ...usuario,
    imagem: normalizarImagemUsuario(usuario.imagem)
  };
}

function normalizarImagemUsuario(valorImagem) {
  if (typeof valorImagem !== 'string') {
    return '';
  }

  const imagem = valorImagem.trim();

  if (!imagem) {
    return '';
  }

  if (/^https?:\/\//i.test(imagem) || imagem.startsWith('data:image/')) {
    return imagem;
  }

  if (imagem.startsWith('/api/arquivos/')) {
    return `http://127.0.0.1:3001${imagem}`;
  }

  if (imagem.startsWith('imagens/')) {
    return `${prefixoImagemApi}${imagem}`;
  }

  return imagem;
}
