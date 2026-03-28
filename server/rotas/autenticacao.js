const express = require('express');
const { consultarUm } = require('../configuracoes/banco');

const rota = express.Router();

rota.post('/login', async (requisicao, resposta) => {
  const { usuario, senha } = requisicao.body || {};

  if (!usuario || !senha) {
    resposta.status(400).json({ mensagem: 'Informe usuario e senha.' });
    return;
  }

  try {
    const usuarioEncontrado = await consultarUm(
      'SELECT * FROM usuario WHERE usuario = ?',
      [String(usuario).trim()]
    );

    if (!usuarioEncontrado || usuarioEncontrado.senha !== senha) {
      resposta.status(401).json({ mensagem: 'Usuario ou senha invalidos.' });
      return;
    }

    if (!usuarioEncontrado.ativo) {
      resposta.status(403).json({ mensagem: 'Usuario inativo.' });
      return;
    }

    resposta.json(removerSenhaUsuario(usuarioEncontrado));
  } catch (_erro) {
    resposta.status(500).json({ mensagem: 'Nao foi possivel autenticar o usuario.' });
  }
});

function removerSenhaUsuario(usuario) {
  const { senha, ...usuarioSemSenha } = usuario;
  return usuarioSemSenha;
}

module.exports = {
  rotaAutenticacao: rota
};
