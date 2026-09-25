import BannerCarrossel from "@/components/BannerCarrossel";
import HeroInicio from "@/components/HeroInicio";
import Diferenciais from "@/components/Diferenciais";
import InicioCatalogo from "@/components/InicioCatalogo";
import { supabase } from "@/lib/supabase";
import { EMPRESA_ID } from "@/lib/empresa";
import { Banner } from "@/types/car";

// Os banners são buscados no servidor: a página já chega com o topo certo, sem piscar.
async function buscarBannersAtivos() {
  let consulta = supabase.from("banners").select("*").eq("ativo", true);
  if (EMPRESA_ID) consulta = consulta.eq("empresa_id", EMPRESA_ID);

  const { data } = await consulta.order("ordem", { ascending: true });
  return (data as Banner[]) || [];
}

export default async function Home() {
  const banners = await buscarBannersAtivos();

  return (
    <div>
      <BannerCarrossel banners={banners} semBanners={<HeroInicio />} />
      <Diferenciais />
      <InicioCatalogo />
    </div>
  );
}
