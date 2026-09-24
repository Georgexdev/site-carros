"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Banner } from "@/types/car";
import Link from "next/link";
import { GripVertical } from "lucide-react";

type Props = {
  banner: Banner;
  onAlternarAtivo: (banner: Banner) => void;
  onExcluir: (banner: Banner) => void;
};

export default function BannerItem({ banner, onAlternarAtivo, onExcluir }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: banner.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between border border-line rounded-2xl p-4 bg-white"
    >
      <div className="flex items-center gap-4">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-soft hover:text-ink w-8 h-10 flex items-center justify-center" aria-label="Arrastar para reordenar"
        >
          <GripVertical size={20} />
        </button>

        <img
          src={banner.imagem_url}
          alt={banner.titulo || "Banner"}
          className="w-32 h-16 object-cover rounded-xl flex-shrink-0"
        />
        <div>
          <p className="font-bold">{banner.titulo || "(sem título)"}</p>
          <p className="text-sm text-muted">{banner.subtitulo}</p>
          <span
            className={
              "inline-block mt-1 text-xs px-2 py-0.5 rounded-full " +
              (banner.ativo
                ? "bg-[#E4F2E9] text-[#0F7B3C]"
                : "bg-[#EFE9DE] text-muted")
            }
          >
            {banner.ativo ? "Ativo" : "Inativo"}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href={"/admin/banners/editar/" + banner.id}
          className="text-sm font-semibold h-9 px-3 inline-flex items-center border border-line-strong rounded-lg bg-white text-ink hover:border-gold transition-colors"
        >
          Editar
        </Link>
        <button
          onClick={() => onAlternarAtivo(banner)}
          className="text-sm font-semibold h-9 px-3 inline-flex items-center border border-line-strong rounded-lg bg-white text-ink hover:border-gold transition-colors"
        >
          {banner.ativo ? "Desativar" : "Ativar"}
        </button>
        <button
          onClick={() => onExcluir(banner)}
          className="text-sm font-semibold h-9 px-3 inline-flex items-center border border-[#F1C7C2] text-[#B42318] rounded-lg bg-white hover:bg-[#FDF1F0] transition-colors"
        >
          Excluir
        </button>
      </div>
    </div>
  );
}