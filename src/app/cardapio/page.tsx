import type { Metadata } from "next";
import CardapioCompleto from "@/components/CardapioCompleto";

export const metadata: Metadata = {
  title: "Cardápio | Dalami Confeitaria",
  description:
    "Cardápio de bolos inteiros por encomenda da Dalami Confeitaria — clássicos, frutados, tradicionais e a linha premium, em quatro tamanhos.",
};

export default function CardapioPage() {
  return <CardapioCompleto />;
}
