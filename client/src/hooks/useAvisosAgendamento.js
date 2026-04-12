import { useEffect, useRef, useState } from 'react';

// `listarAgendamentos` vem de `../servicos/agenda` e entrega a lista mais atual de compromissos cadastrados.
import { listarAgendamentos } from '../servicos/agenda';

// Estes utilitarios de `../utilitarios/avisosAgendamento` encapsulam a montagem de datas, chaves e textos usados nos popups.
import {
  criarChaveAvisoAgendamento,
  criarDataHorarioAgendamento,
  criarDetalhePopupAgendamento,
  criarMensagemPopupAgendamento,
  pertenceAoUsuarioLogado
} from '../utilitarios/avisosAgendamento';

// Este hook concentra toda a regra dos popups de agenda para o usuario autenticado.
// A ideia e deixar o componente visual dos avisos simples e deixar aqui apenas o estado e os efeitos que alimentam essa camada.
export function useAvisosAgendamento(usuarioLogado) {
  // Este estado guarda somente os avisos atualmente visiveis e e consumido pelo componente que renderiza a pilha global.
  const [avisosPopup, definirAvisosPopup] = useState([]);

  // Este `ref` memoriza os avisos ja emitidos sem forcar re-render a cada nova chave adicionada.
  // Usamos `useRef` aqui porque esse historico precisa sobreviver entre renders, mas nao precisa participar da interface.
  const avisosNotificadosRef = useRef(new Set());

  // Quando o usuario logado muda, limpamos tanto os popups quanto o historico de notificacao.
  // Isso evita que avisos de um usuario anterior aparecam no contexto do novo usuario.
  useEffect(() => {
    avisosNotificadosRef.current = new Set();
    definirAvisosPopup([]);
  }, [usuarioLogado?.idUsuario]);

  // Este efeito faz o polling dos agendamentos e transforma compromissos proximos em popups.
  // A dependencia no objeto `usuarioLogado` garante que a busca seja reiniciada quando o contexto da sessao mudar.
  useEffect(() => {
    // Sem usuario valido nao faz sentido consumir a agenda nem criar timers de polling.
    if (!usuarioLogado?.idUsuario) {
      return undefined;
    }

    // Esta flag protege contra atualizacoes de estado depois do unmount ou depois da troca de usuario.
    let desmontado = false;

    // Esta funcao concentra a consulta e a filtragem para manter o corpo do efeito mais legivel.
    async function verificarCompromissosProximos() {
      try {
        // A chamada ao servico busca os registros mais recentes antes de aplicarmos os filtros do frontend.
        const agendamentos = await listarAgendamentos();

        // Se o hook ja tiver sido desmontado, abortamos silenciosamente para evitar race conditions.
        if (desmontado) {
          return;
        }

        // Capturamos o horario atual uma unica vez para comparar todos os compromissos no mesmo referencial.
        const agora = new Date();

        // Este pipeline deixa explicita cada etapa da selecao dos compromissos que devem gerar popup.
        const proximosAvisos = agendamentos
          // Primeiro restringimos a lista aos compromissos que pertencem ao usuario logado.
          .filter((agendamento) => pertenceAoUsuarioLogado(agendamento, usuarioLogado.idUsuario))
          // Depois montamos um `Date` real a partir da data e hora vindas do cadastro.
          .map((agendamento) => ({
            ...agendamento,
            dataHorarioInicio: criarDataHorarioAgendamento(agendamento.data, agendamento.horaInicio)
          }))
          // Ignoramos registros com data invalida para evitar comparacoes quebradas.
          .filter((agendamento) => agendamento.dataHorarioInicio instanceof Date && !Number.isNaN(agendamento.dataHorarioInicio.getTime()))
          // Calculamos a diferenca em minutos porque a regra de exibicao trabalha com janela curta de aviso.
          .map((agendamento) => ({
            ...agendamento,
            diferencaMinutos: Math.round((agendamento.dataHorarioInicio.getTime() - agora.getTime()) / 60000)
          }))
          // So entram avisos que ainda nao passaram e que comecam em ate 15 minutos.
          .filter((agendamento) => agendamento.diferencaMinutos >= 0 && agendamento.diferencaMinutos <= 15)
          // Ordenamos do mais proximo para o mais distante para a pilha refletir urgencia.
          .sort((primeiro, segundo) => primeiro.dataHorarioInicio - segundo.dataHorarioInicio);

        // Aqui descartamos compromissos ja avisados e montamos o formato esperado pela camada visual.
        const novosAvisos = proximosAvisos
          .filter((agendamento) => {
            const chaveAviso = criarChaveAvisoAgendamento(agendamento);
            return !avisosNotificadosRef.current.has(chaveAviso);
          })
          .map((agendamento) => {
            // A chave fica marcada antes do retorno para impedir repeticao na proxima rodada do polling.
            const chaveAviso = criarChaveAvisoAgendamento(agendamento);
            avisosNotificadosRef.current.add(chaveAviso);

            return {
              // O componente visual usa `id` para chave React e para fechar avisos individuais.
              id: chaveAviso,
              // O icone e os textos sao resolvidos aqui para manter a camada de renderizacao o mais declarativa possivel.
              icone: agendamento.iconeStatusVisita || 'Agenda',
              titulo: agendamento.assunto || 'Compromisso na agenda',
              subtitulo: agendamento.tipo || 'Agendamento',
              mensagem: criarMensagemPopupAgendamento(agendamento),
              detalhe: criarDetalhePopupAgendamento(agendamento)
            };
          });

        // Limitamos a pilha a quatro avisos para nao ocupar espaco demais na tela.
        if (novosAvisos.length > 0) {
          definirAvisosPopup((estadoAtual) => [...novosAvisos, ...estadoAtual].slice(0, 4));
        }
      } catch (_erro) {
        // Falhas na consulta nao devem derrubar a interface nem gerar popup de erro para esse processo silencioso.
        return;
      }
    }

    // Executamos uma verificacao imediata para nao obrigar o usuario a esperar o primeiro intervalo.
    verificarCompromissosProximos();
    // O intervalo de um minuto equilibra responsividade e custo de polling.
    const intervalo = window.setInterval(verificarCompromissosProximos, 60000);

    // A limpeza encerra o polling e marca o efeito como desmontado para bloquear respostas atrasadas da promise.
    return () => {
      desmontado = true;
      window.clearInterval(intervalo);
    };
  }, [usuarioLogado]);

  // Este efeito cuida da expiracao automatica de cada popup visivel.
  // A dependencia em `avisosPopup` permite recriar os timers quando a pilha muda.
  useEffect(() => {
    // Sem avisos nao precisamos reservar temporizadores.
    if (avisosPopup.length === 0) {
      return undefined;
    }

    // Cada aviso recebe seu proprio timer para sair sozinho alguns segundos depois.
    const temporizadores = avisosPopup.map((aviso) => window.setTimeout(() => {
      definirAvisosPopup((estadoAtual) => estadoAtual.filter((item) => item.id !== aviso.id));
    }, 12000));

    // Limpamos todos os timers anteriores para evitar remocoes incorretas depois de uma nova renderizacao.
    return () => {
      temporizadores.forEach((temporizador) => window.clearTimeout(temporizador));
    };
  }, [avisosPopup]);

  // Esta acao e exposta para a camada visual remover manualmente um popup especifico.
  function fecharAviso(idAviso) {
    definirAvisosPopup((estadoAtual) => estadoAtual.filter((aviso) => aviso.id !== idAviso));
  }

  // O retorno segue o formato de hook de estado: dados prontos para renderizar e acao para atualiza-los.
  return {
    avisosPopup,
    fecharAviso
  };
}
