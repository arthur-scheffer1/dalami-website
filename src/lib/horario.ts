import { FUSO, HORARIOS_SEMANA } from "./site";

const DIAS: Record<string, number> = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
};

export type EstadoLoja = {
  aberto: boolean;
  /** Hora de fechar, quando aberta; hora de abrir, quando fechada. */
  hora: number;
  /** Se o próximo horário de abrir é só amanhã (ou depois). */
  outroDia: boolean;
};

/**
 * Se a confeitaria está aberta agora.
 *
 * O cálculo usa o fuso de Florianópolis, não o relógio de quem visita: alguém
 * acessando de outro fuso veria a loja fechada no meio da tarde. `hourCycle`
 * h23 evita o "24" que algumas combinações de locale devolvem à meia-noite.
 */
export function estadoDaLoja(agora: Date = new Date()): EstadoLoja {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: FUSO,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(agora);

  const pega = (tipo: string) => partes.find((p) => p.type === tipo)?.value ?? "0";
  const dia = DIAS[pega("weekday")] ?? 0;
  const minutosAgora = Number(pega("hour")) * 60 + Number(pega("minute"));

  const [abre, fecha] = HORARIOS_SEMANA[dia];
  if (minutosAgora >= abre * 60 && minutosAgora < fecha * 60) {
    return { aberto: true, hora: fecha, outroDia: false };
  }

  // Antes de abrir, ainda é hoje; depois de fechar, o próximo é amanhã.
  if (minutosAgora < abre * 60) return { aberto: false, hora: abre, outroDia: false };
  const amanha = (dia + 1) % 7;
  return { aberto: false, hora: HORARIOS_SEMANA[amanha][0], outroDia: true };
}
