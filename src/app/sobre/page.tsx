import type { Metadata } from "next";
import SobreCompleto from "@/components/SobreCompleto";

export const metadata: Metadata = {
  title: "Sobre nós | Dalami Confeitaria",
  description:
    "A história da Dalami Confeitaria, nos Ingleses, em Florianópolis — bolos artesanais produzidos diariamente na própria loja.",
};

export default function SobrePage() {
  return <SobreCompleto />;
}
