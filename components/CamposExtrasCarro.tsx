"use client";

import { opcionaisDisponiveis } from "@/data/opcoesCarro";

type Props = {
  opcionais: string[];
  onMudarOpcionais: (opcionais: string[]) => void;
  descricao: string;
  onMudarDescricao: (descricao: string) => void;
};

export const LIMITE_DESCRICAO = 1500;

// Opcionais (caixinhas) e descrição livre do carro, usados no cadastro e na edição.
export default function CamposExtrasCarro({ opcionais, onMudarOpcionais, descricao, onMudarDescricao }: Props) {
  function alternar(item: string) {
    onMudarOpcionais(opcionais.includes(item) ? opcionais.filter((o) => o !== item) : [...opcionais, item]);
  }

  return (
    <div className="border-t border-line pt-6 space-y-6">
      <fieldset>
        <legend className="block text-sm font-semibold text-ink mb-1">Opcionais</legend>
        <p className="text-[13px] text-muted mb-3">Marque o que o carro tem. Aparece na página do veículo.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
          {opcionaisDisponiveis.map((item) => (
            <label
              key={item}
              className="flex items-center gap-3 min-h-11 text-sm text-ink cursor-pointer [&>input]:w-5 [&>input]:h-5 [&>input]:accent-[#7A6538]"
            >
              <input type="checkbox" checked={opcionais.includes(item)} onChange={() => alternar(item)} />
              {item}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="descricao-carro" className="block text-sm font-semibold text-ink mb-1">
          Descrição <span className="font-normal text-muted text-[13px]">(opcional)</span>
        </label>
        <p className="text-[13px] text-muted mb-3">Estado do carro, revisões, pneus, o que tiver de diferente.</p>
        <textarea
          id="descricao-carro"
          value={descricao}
          maxLength={LIMITE_DESCRICAO}
          rows={5}
          onChange={(e) => onMudarDescricao(e.target.value)}
          placeholder="Ex.: Carro muito conservado, revisões em dia na concessionária, pneus novos."
          className="w-full border border-line-strong rounded-xl bg-[#FBFAF7] px-4 py-3 text-[15px] text-ink placeholder:text-[#8A8174] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
        />
        <p className="text-[12px] text-muted text-right mt-1">
          {descricao.length}/{LIMITE_DESCRICAO}
        </p>
      </div>
    </div>
  );
}
