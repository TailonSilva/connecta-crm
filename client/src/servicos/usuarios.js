import { requisitarApi } from './api';
import { requisitarListaApi } from './listas';

export async function listarUsuarios(opcoes) {
  const usuarios = await requisitarListaApi('/usuarios', {
    campoAtivo: 'ativo',
    ...opcoes
  });

  return Array.isArray(usuarios)
    ? usuarios.map((usuario) => normalizarUsuario(usuario))
    : [];
}

export async function incluirUsuario(payload) {
  const usuario = await requisitarApi('/usuarios', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return normalizarUsuario(usuario);
}

export async function atualizarUsuario(idUsuario, payload) {
  const usuario = await requisitarApi(`/usuarios/${idUsuario}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return normalizarUsuario(usuario);
}

function normalizarUsuario(usuario) {
  if (!usuario) {
    return usuario;
  }

  return {
    ...usuario,
    imagem: adicionarCacheBusterImagem(usuario.imagem)
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
