type PixelCrop = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function criarImagem(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const imagem = new Image();
    imagem.addEventListener("load", () => resolve(imagem));
    imagem.addEventListener("error", (erro) => reject(erro));
    imagem.setAttribute("crossOrigin", "anonymous");
    imagem.src = url;
  });
}

export async function gerarImagemRecortada(
  imagemSrc: string,
  pixelCrop: PixelCrop
): Promise<File> {
  const imagem = await criarImagem(imagemSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Não foi possível processar a imagem.");
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    imagem,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Erro ao gerar a imagem recortada."));
        return;
      }
      const arquivo = new File([blob], "imagem-recortada.jpg", {
        type: "image/jpeg",
      });
      resolve(arquivo);
    }, "image/jpeg");
  });
}