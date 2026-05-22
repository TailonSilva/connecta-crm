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
        { key: 'icone', label: 'Icone', render: (registro) => registro.icone || '-' },
        { key: 'descricao', label: 'Descricao' }
      ]}
      camposFormulario={[
        { name: 'icone', label: 'Icone do servico', maxLength: 20 },
        { name: 'descricao', label: 'Descricao do servico', required: true, maxLength: 255 },
        { name: 'status', label: 'Registro ativo', type: 'checkbox', defaultValue: true }
      ]}
      aoFechar={aoFechar}
      aoSalvar={aoSalvar}
      aoInativar={aoInativar}
    />
  );
}
