import {
  ToyotaLogo, HondaLogo, VolkswagenLogo, ChevroletLogo, FiatLogo,
  HyundaiLogo, JeepLogo, FordLogo, NissanLogo,
  MitsubishiLogo, BMWLogo, MBLogo, AudiLogo, KiaLogo,
  RAMLogo, DodgeLogo, MiniLogo, VolvoLogo, PorscheLogo,
} from "@cardog-icons/react";

function RenaultLogoAdaptado({ size = 32 }: { size?: number }) {
  return (
    <img
      src="https://cdn.simpleicons.org/renault/000000"
      width={size}
      height={size}
      alt="Renault"
    />
  );
}


export const marcasDisponiveis = [
  { nome: "Toyota", Logo: ToyotaLogo },
  { nome: "Honda", Logo: HondaLogo },
  { nome: "Volkswagen", Logo: VolkswagenLogo },
  { nome: "Chevrolet", Logo: ChevroletLogo },
  { nome: "Fiat", Logo: FiatLogo },
  { nome: "Hyundai", Logo: HyundaiLogo },
  { nome: "Jeep", Logo: JeepLogo },
  { nome: "Ford", Logo: FordLogo },
 { nome: "Renault", Logo: RenaultLogoAdaptado },
  { nome: "Nissan", Logo: NissanLogo },
  { nome: "Mitsubishi", Logo: MitsubishiLogo },
  { nome: "BMW", Logo: BMWLogo },
  { nome: "Mercedes-Benz", Logo: MBLogo },
  { nome: "Audi", Logo: AudiLogo },
  { nome: "Kia", Logo: KiaLogo },
  { nome: "RAM", Logo: RAMLogo },
  { nome: "Dodge", Logo: DodgeLogo },
  { nome: "Mini", Logo: MiniLogo },
  { nome: "Volvo", Logo: VolvoLogo },
  { nome: "Porsche", Logo: PorscheLogo },
];