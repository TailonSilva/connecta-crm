const urlApi = 'http://127.0.0.1:3001/api';

export async function requisitarApi(caminho, configuracao) {
  const resposta = await fetch(`${urlApi}${caminho}`, configuracao);
  const textoResposta = await resposta.text();
  const dados = textoResposta ? JSON.parse(textoResposta) : null;

  if (!resposta.ok) {
    throw new Error(dados?.mensagem || 'Falha ao processar a requisicao.');
  }

  return dados;
}
