"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { gerarImagemRecortada } from "@/lib/cropImage";

type Area = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Props = {
  imagemSrc: string;
  aspecto?: number;
  onConfirmar: (arquivo: File) => void;
  onCancelar: () => void;
};

export default function ModalRecorteImagem({
  imagemSrc,
  aspecto = 16 / 9,
  onConfirmar,
  onCancelar,
}: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [areaRecortada, setAreaRecortada] = useState<Area | null>(null);
  const [processando, setProcessando] = useState(false);

  const onCropComplete = useCallback((_: Area, areaEmPixels: Area) => {
    setAreaRecortada(areaEmPixels);
  }, []);

  async function handleConfirmar() {
    if (!areaRecortada) return;

    setProcessando(true);
    try {
      const arquivoRecortado = await gerarImagemRecortada(imagemSrc, areaRecortada);
      onConfirmar(arquivoRecortado);
    } catch (erro) {
      console.error("Erro ao recortar imagem:", erro);
    }
    setProcessando(false);
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl flex flex-col overflow-hidden">
        <div className="p-5 border-b border-line">
          <h2 className="font-display text-xl text-ink">Ajustar imagem</h2>
        </div>

        <div className="relative w-full h-96 bg-malu-surface">
          <Cropper
            image={imagemSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspecto}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="p-4">
          <label className="block text-sm font-semibold text-ink mb-3">Zoom</label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="p-4 border-t border-line flex justify-end gap-3">
          <button
            onClick={onCancelar}
            className="h-11 px-5 rounded-xl border border-line-strong bg-white font-semibold hover:border-gold transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            disabled={processando}
            className="h-11 px-5 rounded-xl bg-malu-black text-gold-light font-bold hover:bg-gold hover:text-malu-black transition-colors disabled:opacity-50"
          >
            {processando ? "Processando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}