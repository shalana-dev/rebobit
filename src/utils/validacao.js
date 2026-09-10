// confere na mao os dados que chegam do frontend na investigacao 

import { PLATAFORMAS } from "../config.js";

const ANO_MIN = 1983;
const ANO_MAX = 2001;
const TEXTO_MAX = 120;
const MODOS = ["single", "multi", "tanto_faz"];

export function validarInvestigacao(corpo) {
  const erros = [];

  if (typeof corpo !== "object" || corpo === null) {
    return { ok: false, erros: ["O corpo precisa ser um objeto JSON."] };
  }

  const idsDeConsole = PLATAFORMAS.map((p) => p.id);
  if (corpo.console !== undefined && !idsDeConsole.includes(corpo.console)) {
    erros.push("console invalido");
  }

  const anoInicio = Number(corpo.anoInicio);
  const anoFim = Number(corpo.anoFim);
  if (corpo.anoInicio !== undefined && !ehAnoValido(anoInicio)) {
    erros.push(`anoInicio precisa estar entre ${ANO_MIN} e ${ANO_MAX}`);
  }
  if (corpo.anoFim !== undefined && !ehAnoValido(anoFim)) {
    erros.push(`anoFim precisa estar entre ${ANO_MIN} e ${ANO_MAX}`);
  }
  if (ehAnoValido(anoInicio) && ehAnoValido(anoFim) && anoInicio > anoFim) {
    erros.push("anoInicio nao pode ser maior que anoFim");
  }

  if (corpo.modo !== undefined && !MODOS.includes(corpo.modo)) {
    erros.push("modo precisa ser single, multi ou tanto_faz");
  }

  for (const campo of ["genero", "cenario", "lembranca"]) {
    const valor = corpo[campo];
    if (
      valor !== undefined &&
      (typeof valor !== "string" || valor.length > TEXTO_MAX)
    ) {
      erros.push(`${campo} precisa ser texto de ate ${TEXTO_MAX} caracteres`);
    }
  }

  if (erros.length > 0) {
    return { ok: false, erros };
  }

  return {
    ok: true,
    dados: {
      console: corpo.console ?? null,
      anoInicio: ehAnoValido(anoInicio) ? anoInicio : null,
      anoFim: ehAnoValido(anoFim) ? anoFim : null,
      genero: limparTexto(corpo.genero),
      modo: corpo.modo ?? null,
      cenario: limparTexto(corpo.cenario),
      lembranca: limparTexto(corpo.lembranca),
    },
  };
}

function ehAnoValido(ano) {
  return Number.isInteger(ano) && ano >= ANO_MIN && ano <= ANO_MAX;
}

function limparTexto(valor) {
  return typeof valor === "string" ? valor.trim() : null;
}
