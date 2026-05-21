import { CodigoRegistro } from '../comuns/codigoRegistro';
import { ModalCadastroConfiguracao } from './configuracoes-modalCadastroConfiguracao';

export function ModalServicos({
  aberto,
  registros,
  somenteConsulta = false,
  aoFechar,
  aoSalvar,
  aoInativar
}) {
  return (
    <ModalCadastroConfiguracao
      aberto={aberto}
      titulo="Servicos"
      rotuloIncluir="Incluir servico"
      registros={registros}
      chavePrimaria="idServico"
      somenteConsulta={somenteConsulta}
      colunas={[
        { key: 'idServico', label: 'Codigo', render: (registro) => <CodigoRegistro valor={registro.idServico} /> },
        { key: 'descricao', label: 'Descricao' }
      ]}
      camposFormulario={[
        { name: 'descricao', label: 'Descricao do servico', required: true, maxLength: 255 },
        { name: 'status', label: 'Registro ativo', type: 'checkbox', defaultValue: true }
      ]}
      aoFechar={aoFechar}
      aoSalvar={aoSalvar}
      aoInativar={aoInativar}
    />
  );
}
