import { CodigoRegistro } from '../comuns/codigoRegistro';
import { GradePadrao } from '../comuns/gradePadrao';
import { TextoGradeClamp } from '../comuns/textoGradeClamp';

export function ListaServicos({
  linhas,
  servicos,
  carregando,
  mensagemErro
}) {
  return (
    <GradePadrao
      className="gradePainelServicos"
      classNameTabela="tabelaServicos tabelaServicosContratados"
      cabecalho={(
        <tr className="cabecalhoGradeServicos">
          <th className="colunaServicoClienteCodigo">Codigo</th>
          <th className="colunaServicoClienteNome">Nome fantasia</th>
          {servicos.map((servico) => (
            <th key={servico.idServico} className="colunaServicoContratado">
              <TextoGradeClamp>{servico.descricao || `Servico #${servico.idServico}`}</TextoGradeClamp>
            </th>
          ))}
        </tr>
      )}
      carregando={carregando}
      mensagemErro={mensagemErro}
      temItens={linhas.length > 0 && servicos.length > 0}
      mensagemCarregando="Carregando servicos por cliente..."
      mensagemVazia={servicos.length === 0 ? 'Nenhum servico cadastrado.' : 'Nenhum cliente encontrado.'}
    >
      {linhas.map((linha) => (
        <tr key={linha.idCliente} className="linhaServico">
          <td className="colunaServicoClienteCodigo">
            <CodigoRegistro valor={linha.codigoCliente} />
          </td>
          <td className="colunaServicoClienteNome">
            <TextoGradeClamp>{linha.nomeFantasia || 'Cliente nao informado'}</TextoGradeClamp>
          </td>
          {servicos.map((servico) => {
            const vinculo = linha.servicosPorId.get(String(servico.idServico));
            const situacao = obterSituacaoServicoCliente(vinculo);
            const observacao = String(vinculo?.observacao || '').trim();
            const titulo = observacao || 'Sem observacao';

            return (
              <td key={servico.idServico} className="colunaServicoContratado">
                <span
                  className={`indicadorServicoContratado ${situacao}`}
                  title={titulo}
                  aria-label={`${servico.descricao || 'Servico'}: ${obterRotuloSituacaoServicoCliente(situacao)}. ${titulo}`}
                >
                  {obterMarcadorSituacaoServicoCliente(situacao)}
                </span>
              </td>
            );
          })}
        </tr>
      ))}
    </GradePadrao>
  );
}

function obterSituacaoServicoCliente(vinculo) {
  const situacao = String(vinculo?.situacao || '').trim();

  if (['contratado', 'naoContratado', 'naoAplicavel'].includes(situacao)) {
    return situacao;
  }

  return vinculo?.contratado ? 'contratado' : 'naoContratado';
}

function obterRotuloSituacaoServicoCliente(situacao) {
  if (situacao === 'contratado') {
    return 'contratado';
  }

  if (situacao === 'naoAplicavel') {
    return 'nao aplicavel';
  }

  return 'nao contratado';
}

function obterMarcadorSituacaoServicoCliente(situacao) {
  if (situacao === 'contratado') {
    return '\u2713';
  }

  if (situacao === 'naoAplicavel') {
    return 'N/A';
  }

  return 'X';
}
