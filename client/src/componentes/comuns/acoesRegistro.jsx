import { BotaoAcaoGrade } from './botaoAcaoGrade';

export function AcoesRegistro({
  rotuloConsulta = 'Consultar registro',
  rotuloEdicao = 'Editar registro',
  rotuloInativacao = 'Inativar registro',
  exibirConsulta = true,
  exibirEdicao = true,
  exibirInativacao = true,
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
        <BotaoAcaoGrade icone="editar" titulo={rotuloEdicao} onClick={aoEditar} />
      ) : null}
      {exibirInativacao ? (
        <BotaoAcaoGrade icone="inativar" titulo={rotuloInativacao} onClick={aoInativar} />
      ) : null}
    </div>
  );
}
