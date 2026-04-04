import { ModalHistoricoGrade } from '../../componentes/comuns/modalHistoricoGrade';
import { TabelaHistoricoAtendimentos } from '../../componentes/comuns/tabelaHistoricoAtendimentos';
import '../../recursos/estilos/modalHistoricoAtendimentosCliente.css';

export function ModalHistoricoAtendimentosCliente({
  aberto,
  cliente,
  carregando,
  mensagemErro,
  atendimentos,
  filtrosAtivos,
  valorPesquisa = '',
  onAlterarPesquisa,
  onFechar,
  onAbrirFiltros,
  onConsultarAtendimento
}) {
  return (
    <ModalHistoricoGrade
      aberto={aberto}
      titulo="Atendimentos do cliente"
      subtitulo={cliente?.nomeFantasia || cliente?.razaoSocial || 'Cliente nao salvo'}
      className="modalHistoricoAtendimentosCliente"
      filtrosAtivos={filtrosAtivos}
      tituloFiltro="Filtrar atendimentos"
      ariaFiltro="Filtrar atendimentos"
      valorPesquisa={valorPesquisa}
      onAlterarPesquisa={onAlterarPesquisa}
      placeholderPesquisa="Pesquisar em atendimentos..."
      onAbrirFiltros={onAbrirFiltros}
      onFechar={onFechar}
    >
      <section className="painelContatosModalCliente modalHistoricoAtendimentosClientePainel">
        <TabelaHistoricoAtendimentos
          carregando={carregando}
          mensagemErro={mensagemErro}
          atendimentos={atendimentos}
          contextoSalvo={Boolean(cliente?.idCliente)}
          mensagemSemContexto="Os atendimentos ficarao disponiveis apos salvar o cliente."
          mensagemVazia="Nenhum atendimento encontrado com os filtros informados."
          exibirAcoes
          onConsultarAtendimento={onConsultarAtendimento}
        />
      </section>
    </ModalHistoricoGrade>
  );
}
