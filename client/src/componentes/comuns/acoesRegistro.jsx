import { BotaoAcaoGrade } from './botaoAcaoGrade';

export function AcoesRegistro({
  rotuloConsulta = 'Consultar registro',
  rotuloEdicao = 'Editar registro',
  rotuloInativacao = 'Inativar registro',
  iconeInativacao = 'inativar',
  exibirConsulta = true,
  exibirEdicao = true,
  exibirInativacao = true,
  desabilitarEdicao = false,
  aoConsultar,
  aoEditar,
  aoInativar
}) {
  return (
    <div className="acoesRegistro">
      {exibirConsulta ? (
        <BotaoAcaoGrade icone="consultar" titulo={rotuloConsulta} onClick={aoConsultar} />
        ) : null}
      {exibirEdicao ? (
        <BotaoAcaoGrade icone="editar" titulo={rotuloEdicao} onClick={aoEditar} disabled={desabilitarEdicao} />
      ) : null}
      {exibirInativacao ? (
        <BotaoAcaoGrade icone={iconeInativacao} titulo={rotuloInativacao} onClick={aoInativar} />
      ) : null}
    </div>
  );
}
