import { useEffect, useState } from 'react';
import { Botao } from '../comuns/botao';
import { CampoSelecaoMultiplaModal } from '../comuns/campoSelecaoMultiplaModal';
import '../../recursos/estilos/servicos-modalFiltrosServicos.css';

const filtrosIniciaisServicos = {
  idVendedor: [],
  idConceito: [],
  idGrupoEmpresa: [],
  status: [],
  estado: [],
  servicos: []
};

export function ModalFiltrosServicos({
  aberto,
  filtros,
  vendedores,
  conceitosCliente,
  gruposEmpresa,
  estados,
  servicos,
  aoFechar,
  aoAplicar,
  aoLimpar
}) {
  const [formulario, definirFormulario] = useState(filtrosIniciaisServicos);

  useEffect(() => {
    if (!aberto) {
      return;
    }

    definirFormulario(normalizarFormularioFiltros(filtros));
  }, [aberto, filtros]);

  useEffect(() => {
    if (!aberto) {
      return undefined;
    }

    function tratarTecla(evento) {
      if (evento.key === 'Escape') {
        aoFechar();
      }
    }

    window.addEventListener('keydown', tratarTecla);

    return () => {
      window.removeEventListener('keydown', tratarTecla);
    };
  }, [aberto, aoFechar]);

  if (!aberto) {
    return null;
  }

  function aplicarFiltros(evento) {
    evento.preventDefault();
    aoAplicar(normalizarFormularioFiltros(formulario));
  }

  function limparFiltros() {
    definirFormulario(filtrosIniciaisServicos);
    aoLimpar();
  }

  function fecharAoClicarNoFundo(evento) {
    if (evento.target === evento.currentTarget) {
      aoFechar();
    }
  }

  return (
    <div className="camadaModalContato" role="presentation" onMouseDown={fecharAoClicarNoFundo}>
      <form
        className="modalContatoCliente modalFiltros modalFiltrosServicos"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tituloModalFiltrosServicos"
        onMouseDown={(evento) => evento.stopPropagation()}
        onSubmit={aplicarFiltros}
      >
        <div className="cabecalhoModalContato">
          <h3 id="tituloModalFiltrosServicos">Filtros de servicos</h3>

          <div className="acoesFormularioContatoModal">
            <Botao variante="secundario" type="button" icone="limpar" somenteIcone title="Limpar" aria-label="Limpar" onClick={limparFiltros}>
              Limpar
            </Botao>
            <Botao variante="secundario" type="button" icone="fechar" somenteIcone title="Fechar" aria-label="Fechar" onClick={aoFechar}>
              Cancelar
            </Botao>
            <Botao variante="primario" type="submit" icone="confirmar" somenteIcone title="Aplicar" aria-label="Aplicar">
              Aplicar
            </Botao>
          </div>
        </div>

        <div className="corpoModalContato">
          <section className="gradeCamposModalCliente gradeFiltrosModal gradeFiltrosServicosCliente">
            <CampoSelecaoMultiplaModal
              label="Vendedor"
              titulo="Vendedor"
              itens={(vendedores || []).map((vendedor) => ({
                valor: vendedor.idVendedor,
                label: vendedor.nome || `Vendedor #${vendedor.idVendedor}`
              }))}
              valoresSelecionados={formulario.idVendedor}
              placeholder="Todos"
              aoAlterar={(valores) => alterarListaFiltro('idVendedor', valores)}
            />
            <CampoSelecaoMultiplaModal
              label="Conceito"
              titulo="Conceito"
              itens={(conceitosCliente || []).map((conceito) => ({
                valor: conceito.idConceito,
                label: conceito.descricao || `Conceito #${conceito.idConceito}`
              }))}
              valoresSelecionados={formulario.idConceito}
              placeholder="Todos"
              aoAlterar={(valores) => alterarListaFiltro('idConceito', valores)}
            />
            <CampoSelecaoMultiplaModal
              label="Grupo de empresa"
              titulo="Grupo de empresa"
              itens={(gruposEmpresa || []).map((grupo) => ({
                valor: grupo.idGrupoEmpresa,
                label: grupo.descricao || `Grupo #${grupo.idGrupoEmpresa}`
              }))}
              valoresSelecionados={formulario.idGrupoEmpresa}
              placeholder="Todos"
              aoAlterar={(valores) => alterarListaFiltro('idGrupoEmpresa', valores)}
            />
            <CampoSelecaoMultiplaModal
              label="Ativo"
              titulo="Ativo"
              itens={[
                { valor: 'ativo', label: 'Ativo' },
                { valor: 'inativo', label: 'Inativo' }
              ]}
              valoresSelecionados={formulario.status}
              placeholder="Todos"
              aoAlterar={(valores) => alterarListaFiltro('status', valores)}
            />
            <CampoSelecaoMultiplaModal
              label="Estado"
              titulo="Estado"
              itens={(estados || []).map((estado) => ({
                valor: estado,
                label: estado
              }))}
              valoresSelecionados={formulario.estado}
              placeholder="Todos"
              aoAlterar={(valores) => alterarListaFiltro('estado', valores)}
            />
            <CampoSelecaoMultiplaModal
              className="campoFormularioIntegral"
              label="Servicos"
              titulo="Servicos"
              itens={(servicos || []).map((servico) => ({
                valor: String(servico.idServico),
                label: `${servico.icone ? `${servico.icone} ` : ''}${servico.descricao || `Servico #${servico.idServico}`}`
              }))}
              valoresSelecionados={formulario.servicos}
              placeholder="Todos"
              aoAlterar={(valores) => definirFormulario((estadoAtual) => ({
                ...estadoAtual,
                servicos: valores.map((valor) => String(valor))
              }))}
            />
          </section>
        </div>
      </form>
    </div>
  );

  function alterarListaFiltro(nomeCampo, valores) {
    definirFormulario((estadoAtual) => ({
      ...estadoAtual,
      [nomeCampo]: valores.map((valor) => String(valor))
    }));
  }
}

function normalizarFormularioFiltros(filtros) {
  return {
    idVendedor: normalizarListaFiltro(filtros?.idVendedor),
    idConceito: normalizarListaFiltro(filtros?.idConceito),
    idGrupoEmpresa: normalizarListaFiltro(filtros?.idGrupoEmpresa),
    status: normalizarListaFiltro(filtros?.status).filter((valor) => ['ativo', 'inativo'].includes(valor)),
    estado: normalizarListaFiltro(filtros?.estado).map((estado) => estado.toUpperCase()),
    servicos: Array.isArray(filtros?.servicos)
      ? filtros.servicos.map((idServico) => String(idServico)).filter(Boolean)
      : []
  };
}

function normalizarListaFiltro(valor) {
  if (Array.isArray(valor)) {
    return valor.map((item) => String(item).trim()).filter(Boolean);
  }

  const texto = String(valor || '').trim();
  return texto ? [texto] : [];
}
