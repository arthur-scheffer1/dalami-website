import Hero from "@/components/Hero";
import BoloHeroi from "@/components/BoloHeroi";
import PreCardapio from "@/components/PreCardapio";
import Composicao from "@/components/Composicao";
import SobreMarca from "@/components/SobreMarca";
import Encomendas from "@/components/Encomendas";
import Depoimentos from "@/components/Depoimentos";
import Localizacao from "@/components/Localizacao";
import NossaLoja from "@/components/NossaLoja";
import Instagram from "@/components/Instagram";

export default function Home() {
  return (
    <main>
      <Hero />
      <BoloHeroi />
      <PreCardapio />
      <Composicao />
      <SobreMarca />
      <NossaLoja />
      <Encomendas />
      <Depoimentos />
      <Instagram />
      <Localizacao />
    </main>
  );
}
