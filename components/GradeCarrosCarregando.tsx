type Props = {
  quantidade?: number;
};

export default function GradeCarrosCarregando({ quantidade = 6 }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" aria-busy="true" aria-label="Carregando carros">
      {Array.from({ length: quantidade }).map((_, index) => (
        <div key={index} className="bg-white border border-line rounded-2xl overflow-hidden animate-pulse">
          <div className="h-52 bg-malu-surface" />
          <div className="p-5 flex flex-col gap-3">
            <div className="h-3 w-20 rounded bg-line" />
            <div className="h-5 w-40 rounded bg-line" />
            <div className="h-3 w-32 rounded bg-line" />
            <div className="h-10 w-full rounded-lg bg-[#EFE9DE] mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}
