import { normalizarPreco } from '../../utilitarios/normalizarPreco';
import { ModalManualPagina } from '../../componentes/comuns/modalManualPagina';

export function ModalManualInicio({
  aberto,
  aoFechar,
  totalClientes = 0,
  totalProdutos = 0,
  totalContatos = 0,
  totalAtendimentos = 0,
  totalAgendamentos = 0,
  totalCarteiraAberta = 0,
  totalVendasValor = 0,
  totalVendasQuantidade = 0,
  ticketMedioPedidos = 0,
  taxaConversaoPedidos = 0,
  filtros = {},
  orcamentos = [],
  pedidos = [],
  etapasFunil = [],
  rankingVendedores = [],
  empresa,
  usuarioLogado
}) {
  const quantidadeFiltros = [
    filtros.dataInclusaoInicio,
    filtros.dataInclusaoFim,
    filtros.dataFechamentoInicio,
    filtros.dataFechamentoFim,
    ...(Array.isArray(filtros.idVendedor) ? filtros.idVendedor : []),
    ...(Array.isArray(filtros.idProduto) ? filtros.idProduto : []),
    ...(Array.isArray(filtros.idGrupo) ? filtros.idGrupo : []),
    ...(Array.isArray(filtros.idMarca) ? filtros.idMarca : [])
  ].filter(Boolean).length;

  return (
    <ModalManualPagina
      aberto={aberto}
      aoFechar={aoFechar}
      titulo="Manual da Pagina Inicial"
      descricao="Registro temporario do reset da pagina inicial para a proxima etapa de construcao."
      eyebrow="Reinicio da home"
      heroTitulo="Pagina inicial limpa para recomecar"
      heroDescricao="Todos os cards, graficos e paineis da home foram removidos. A tela fica como um espaco neutro enquanto a nova proposta visual e funcional ainda sera definida."
      painelHeroi={[
        { valor: '0 cards', rotulo: 'Elementos analiticos ativos' },
        { valor: '0 graficos', rotulo: 'Visualizacoes ativas' },
        { valor: 'Nova etapa', rotulo: 'Estado atual da home' }
      ]}
      cardsResumo={[
        {
          titulo: 'Home zerada',
          descricao: 'A pagina inicial foi propositalmente esvaziada para reiniciar o desenho do dashboard.',
          detalhe: 'Nao ha cards, graficos ou filtros ativos neste momento.',
          icone: 'inicio'
        },
        {
          titulo: 'Objetivo desta etapa',
          descricao: 'Remover a camada analitica anterior para abrir espaco a uma nova definicao estrutural.',
          detalhe: 'A proxima iteracao pode reconstruir a home sem carregar o legado visual anterior.',
          icone: 'configuracoes'
        },
        {
          titulo: 'Estado temporario',
          descricao: 'O cabecalho continua acessivel, assim como este manual por F1.',
          detalhe: 'Os filtros da home tambem foram retirados junto com os cards.',
          icone: 'manual'
        },
        {
          titulo: 'Perfil atual',
          descricao: usuarioLogado?.tipo === 'Usuario padrao'
            ? 'Usuario padrao continua acessando a home, agora em estado neutro.'
            : 'Perfis administrativos tambem encontram a home sem paineis no momento.',
          detalhe: 'A limpeza foi aplicada para todos os perfis.',
          icone: 'usuarios'
        }
      ]}
      cardsFluxo={[
        {
          titulo: 'Remocao do legado',
          descricao: 'A primeira etapa foi apagar todos os cards e blocos analiticos da home.',
          icone: 'limpar'
        },
        {
          titulo: 'Preparar nova estrutura',
          descricao: 'Com a tela zerada, o proximo dashboard pode nascer sem amarras da versao anterior.',
          icone: 'adicionar'
        },
        {
          titulo: 'Usar o manual como marco',
          descricao: 'Este manual registra que a home foi esvaziada intencionalmente antes da reconstrucao.',
          icone: 'manual'
        },
        {
          titulo: 'Definir os proximos blocos',
          descricao: 'A partir daqui a nova home pode ser remontada por etapas, com base no que for decidido na proxima solicitacao.',
          icone: 'confirmar'
        }
      ]}
      blocosTexto={[
        {
          tag: 'Estado atual',
          titulo: 'O que foi removido da home',
          itens: [
            'Todos os cards KPI da pagina inicial foram removidos.',
            'Todos os graficos e rankings da home foram removidos.',
            'O funil e os filtros da pagina inicial tambem deixaram de ser exibidos.',
            'A tela ficou reduzida a um estado neutro para recomeco do desenho.'
          ]
        },
        {
          tag: 'Proximo passo',
          titulo: 'Como seguir a partir deste ponto',
          itens: [
            'A proxima iteracao pode definir uma nova hierarquia visual sem herdar os cards anteriores.',
            'Os dados e servicos continuam existindo no projeto, mas nao aparecem mais na home por enquanto.',
            'Quando a nova proposta for escolhida, a tela pode ser montada novamente por secoes.'
          ]
        }
      ]}
      cardsRegras={[
        {
          titulo: 'Reset intencional',
          descricao: 'A limpeza da home foi aplicada de forma explicita para recomecar a construcao do dashboard.',
          detalhe: 'Nao se trata de erro nem de indisponibilidade de dados.',
          icone: 'limpar'
        },
        {
          titulo: 'Atualizacao por empresa',
          descricao: 'Mudancas da empresa continuam podendo influenciar a futura home, mas nao ha painel ativo agora.',
          detalhe: 'O reset visual nao remove as configuracoes salvas no restante do sistema.',
          icone: 'empresa'
        },
        {
          titulo: 'Sem filtros na home',
          descricao: 'Os filtros da pagina inicial sairam junto com os cards e nao aparecem nesta etapa.',
          detalhe: 'Eles podem voltar depois, se fizer sentido na nova proposta.',
          icone: 'filtro'
        },
        {
          titulo: 'Base pronta para reconstrucao',
          descricao: 'A pagina inicial ficou reduzida ao minimo necessario para iniciar um novo desenho.',
          detalhe: 'A nova iteracao pode ser montada diretamente sobre essa base limpa.',
          icone: 'inicio'
        }
      ]}
    />
  );
}
