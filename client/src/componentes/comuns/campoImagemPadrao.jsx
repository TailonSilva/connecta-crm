import { useRef } from 'react';
import { Botao } from './botao';
import { CodigoRegistro } from './codigoRegistro';

export function CampoImagemPadrao({
  valor,
  alt,
  iniciais,
  onChange,
  disabled = false,
  codigo,
  rotuloBotao = 'Imagem'
}) {
  const campoArquivoImagem = useRef(null);

  function abrirSelecaoImagem() {
    if (!disabled) {
      campoArquivoImagem.current?.click();
    }
  }

  function carregarImagem(evento) {
    const arquivo = evento.target.files?.[0];

    if (!arquivo) {
      return;
    }

    const leitor = new FileReader();

    leitor.onload = () => {
      onChange(typeof leitor.result === 'string' ? leitor.result : '');
    };

    leitor.readAsDataURL(arquivo);
    evento.target.value = '';
  }

  return (
    <div className="thumbnailCliente">
      {codigo !== undefined ? (
        <div className="codigoThumbnailCliente">
          <CodigoRegistro valor={codigo} />
        </div>
      ) : null}

      <div className="previewThumbnailCliente">
        {valor ? (
          <img src={valor} alt={alt} />
        ) : (
          <span>{iniciais}</span>
        )}
      </div>

      <input
        ref={campoArquivoImagem}
        type="file"
        accept="image/*"
        className="campoArquivoImagem"
        onChange={carregarImagem}
      />

      <Botao
        variante="secundario"
        icone="upload"
        type="button"
        onClick={abrirSelecaoImagem}
        disabled={disabled}
      >
        {rotuloBotao}
      </Botao>
    </div>
  );
}
