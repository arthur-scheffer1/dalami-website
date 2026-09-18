"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  // No celular, esconder e mostrar a barra de endereço muda a altura da
  // janela e dispara um resize no meio da rolagem. Sem isto o ScrollTrigger
  // remede a página inteira nesse instante — e é aí que a rolagem trava.
  // Com a opção ligada, a altura só é remedida na virada de orientação.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, SplitText };
