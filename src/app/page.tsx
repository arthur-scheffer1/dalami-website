import Hero from "@/components/Hero";
import BoloHeroi from "@/components/BoloHeroi";
import PreCardapio from "@/components/PreCardapio";
import Composicao from "@/components/Composicao";
import SobreMarca from "@/components/SobreMarca";
import Encomendas from "@/components/Encomendas";
import Depoimentos from "@/components/Depoimentos";
import Localizacao from "@/components/Localizacao";

export default function Home() {
  return (
    <main>
      <Hero />
      <BoloHeroi />
      <PreCardapio />
      <Composicao />
      <SobreMarca />
      <Encomendas />
      <Depoimentos />
      <Localizacao />
    </main>
  );
}
