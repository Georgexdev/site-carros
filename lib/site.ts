// Endereço público do site, usado pelo Google (sitemap, robots, links de compartilhamento).
// Para outro cliente, configure NEXT_PUBLIC_SITE_URL na Vercel com o domínio dele.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://malu-veiculos.vercel.app").replace(/\/$/, "");
