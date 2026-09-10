// da uma nota de compatibilidade para cada candidato e escolhe os 3 melhores.

import { PLATAFORMAS, GENEROS, CENARIOS } from "../config.js";
import { pontosDaLembranca } from "./pistas.js";

const PESOS = {
  plataforma: 20,
  periodo: 20,
  genero: 20,
  modo: 10,
  cenario: 15,
  lembranca: 15,
};

export function escolherTresMelhores(investigacao, candidatos) {
  const avaliados = candidatos.map((candidato) => ({
    candidato,
    fatores: avaliarCandidato(investigacao, candidato),
  }));

  const cenarioAcertou = avaliados.some((a) => a.fatores.cenario.ganho > 0);
  const lembrancaAcertou = avaliados.some((a) => a.fatores.lembranca.ganho > 0);
  const flags = { cenarioAcertou, lembrancaAcertou };

  const comNota = avaliados.map((a) => ({
    ...a.candidato,
    compatibilidade: calcularNota(a.fatores, flags),
    motivo: montarMotivo(investigacao, a.fatores, flags),
  }));

  comNota.sort((x, y) => {
    if (y.compatibilidade !== x.compatibilidade) {
      return y.compatibilidade - x.compatibilidade;
    }
    return (y.rating ?? 0) - (x.rating ?? 0);
  });

  return comNota.slice(0, 3);
}

export function avaliarCandidato(investigacao, candidato) {
  const fatores = {};

  const consoleValido = PLATAFORMAS.some((p) => p.id === investigacao.console);
  fatores.plataforma = {
    vale: consoleValido,
    ganho: consoleValido ? PESOS.plataforma : 0,
  };

  const temPeriodo =
    investigacao.anoInicio != null && investigacao.anoFim != null;
  fatores.periodo = {
    vale: temPeriodo,
    ganho: temPeriodo ? pontosPeriodo(investigacao, candidato) : 0,
  };

  const genero = GENEROS.find((g) => g.id === investigacao.genero);
  fatores.genero = {
    vale: Boolean(genero),
    ganho:
      genero && candidato.generos.includes(genero.rawgSlug) ? PESOS.genero : 0,
  };

  const temModo =
    investigacao.modo === "single" || investigacao.modo === "multi";
  fatores.modo = {
    vale: temModo,
    ganho: temModo ? pontosModo(investigacao.modo, candidato) : 0,
  };

  const cenario = CENARIOS.find((c) => c.id === investigacao.cenario);
  const cenarioVale = Boolean(cenario) && cenario.slugs.length > 0;
  fatores.cenario = {
    vale: cenarioVale,
    ganho: cenarioVale && cenarioBate(cenario, candidato) ? PESOS.cenario : 0,
  };

  const temLembranca = Boolean(investigacao.lembranca);
  const lembranca = pontosDaLembranca(investigacao.lembranca, candidato.nome);
  fatores.lembranca = {
    vale: temLembranca,
    ganho: temLembranca ? lembranca.pontos : 0,
    conceitos: lembranca.conceitos,
  };

  return fatores;
}

function calcularNota(fatores, flags) {
  let ganhos = 0;
  let possiveis = 0;

  for (const [nome, dados] of Object.entries(fatores)) {
    let conta = dados.vale;
    if (nome === "cenario" && !flags.cenarioAcertou) conta = false;
    if (nome === "lembranca" && !flags.lembrancaAcertou) conta = false;

    if (conta) {
      ganhos += dados.ganho;
      possiveis += PESOS[nome];
    }
  }

  return possiveis === 0 ? 0 : Math.round((ganhos / possiveis) * 100);
}

function montarMotivo(investigacao, fatores, flags) {
  const clausulas = [];

  if (fatores.plataforma.ganho > 0) {
    const p = PLATAFORMAS.find((x) => x.id === investigacao.console);
    clausulas.push(`compativel com ${p.nome}`);
  }
  if (fatores.periodo.vale && fatores.periodo.ganho > 0) {
    clausulas.push(
      fatores.periodo.ganho === PESOS.periodo
        ? "lancado no periodo indicado"
        : "lancado perto do periodo indicado",
    );
  }
  if (fatores.genero.ganho > 0) {
    const g = GENEROS.find((x) => x.id === investigacao.genero);
    clausulas.push(`do genero ${g.nome.toLowerCase()}`);
  }
  if (fatores.modo.ganho === PESOS.modo) {
    clausulas.push(
      investigacao.modo === "single"
        ? "para um jogador"
        : "para varios jogadores",
    );
  }
  if (flags.cenarioAcertou && fatores.cenario.ganho > 0) {
    const c = CENARIOS.find((x) => x.id === investigacao.cenario);
    clausulas.push(`com cenario de ${c.nome.toLowerCase()}`);
  }
  if (flags.lembrancaAcertou && fatores.lembranca.ganho > 0) {
    clausulas.push("combina com a sua lembranca");
  }

  if (clausulas.length === 0) {
    return "Escolhido pela popularidade na epoca.";
  }

  const frase = juntarComE(clausulas);
  return frase.charAt(0).toUpperCase() + frase.slice(1) + ".";
}

function juntarComE(lista) {
  if (lista.length === 1) return lista[0];
  return lista.slice(0, -1).join(", ") + " e " + lista[lista.length - 1];
}

function pontosPeriodo(investigacao, candidato) {
  if (candidato.ano == null) return 0;

  const { anoInicio, anoFim } = investigacao;
  if (candidato.ano >= anoInicio && candidato.ano <= anoFim) {
    return PESOS.periodo;
  }

  const distancia =
    candidato.ano < anoInicio
      ? anoInicio - candidato.ano
      : candidato.ano - anoFim;

  return Math.max(PESOS.periodo - distancia * 5, 0);
}

function pontosModo(modo, candidato) {
  const temSingle = candidato.tags.includes("singleplayer");
  const temMulti = candidato.tags.includes("multiplayer");

  if (!temSingle && !temMulti) return 5;
  if (modo === "single") return temSingle ? PESOS.modo : 0;
  return temMulti ? PESOS.modo : 0;
}

function cenarioBate(cenario, candidato) {
  const doJogo = [...candidato.generos, ...candidato.tags];
  return cenario.slugs.some((slug) => doJogo.includes(slug));
}
