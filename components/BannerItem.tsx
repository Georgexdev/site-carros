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
      className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between border rounded-lg p-4 bg-white"
    >
      <div className="flex items-center gap-4">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        >
          <GripVertical size={20} />
        </button>

        <img
          src={banner.imagem_url}
          alt={banner.titulo || "Banner"}
          className="w-32 h-16 object-cover rounded-lg flex-shrink-0"
        />
        <div>
          <p className="font-bold">{banner.titulo || "(sem título)"}</p>
          <p className="text-sm text-gray-500">{banner.subtitulo}</p>
          <span
            className={
              "inline-block mt-1 text-xs px-2 py-0.5 rounded-full " +
              (banner.ativo
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500")
            }
          >
            {banner.ativo ? "Ativo" : "Inativo"}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href={"/admin/banners/editar/" + banner.id}
          className="text-sm px-3 py-1.5 border rounded-lg hover:bg-gray-50"
        >
          Editar
        </Link>
        <button
          onClick={() => onAlternarAtivo(banner)}
          className="text-sm px-3 py-1.5 border rounded-lg hover:bg-gray-50"
        >
          {banner.ativo ? "Desativar" : "Ativar"}
        </button>
        <button
          onClick={() => onExcluir(banner)}
          className="text-sm px-3 py-1.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
        >
          Excluir
        </button>
      </div>
    </div>
  );
}