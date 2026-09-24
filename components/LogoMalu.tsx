import { Car } from "lucide-react";

type Props = {
  tamanho?: "sm" | "md";
  comIcone?: boolean;
};

export default function LogoMalu({ tamanho = "md", comIcone = true }: Props) {
  const pequeno = tamanho === "sm";

  return (
    <span className="flex items-center gap-3">
      {comIcone && (
        <Car
          aria-hidden="true"
          strokeWidth={1.3}
          className={"text-gold shrink-0 " + (pequeno ? "w-8 h-8" : "w-10 h-10")}
        />
      )}
      <span className="flex flex-col gap-1">
        <span
          className={
            "font-display text-gold leading-none tracking-[0.12em] " +
            (pequeno ? "text-2xl" : "text-[30px]")
          }
        >
          MALU
        </span>
        <span
          className={
            "text-gold-light font-semibold uppercase leading-none " +
            (pequeno ? "text-[7px] tracking-[0.3em]" : "text-[8.5px] tracking-[0.32em]")
          }
        >
          Veículos e Financiamentos
        </span>
      </span>
    </span>
  );
}
