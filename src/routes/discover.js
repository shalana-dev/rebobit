// src/routes/discover.js
// Rota que recebe as respostas da investigacao e devolve os candidatos.

import { Router } from "express";
import { validarInvestigacao } from "../utils/validacao.js";
import { rawgGet } from "../services/rawg.js";
import { PLATAFORMAS } from "../config.js";

const router = Router();

function montarFiltrosRawg(dados) {
  const params = { page_size: 20 };

  if (dados.console) {
    const plataforma = PLATAFORMAS.find((p) => p.id === dados.console);
    if (plataforma) {
      params.platforms = plataforma.rawgId;
    }
  }

  if (dados.anoInicio && dados.anoFim) {
    params.dates = `${dados.anoInicio}-01-01,${dados.anoFim}-12-31`;
  }

  const termos = [dados.genero, dados.cenario, dados.lembranca]
    .filter((texto) => texto)
    .join(" ");

  if (termos) {
    params.search = termos;
  }

  return params;
}

function formatarCandidato(jogo) {
  return {
    id: jogo.id,
    slug: jogo.slug,
    nome: jogo.name,
    lancamento: jogo.released ?? null,
    ano: jogo.released ? Number(jogo.released.slice(0, 4)) : null,
    imagem: jogo.background_image ?? null,
    plataformas: (jogo.platforms ?? []).map((item) => item.platform.name),
    generos: (jogo.genres ?? []).map((genero) => genero.slug),
    tags: (jogo.tags ?? []).map((tag) => tag.slug),
    rating: jogo.rating ?? null,
    metacritic: jogo.metacritic ?? null,
    relevanciaRawg: jogo.score ? Number(jogo.score) : null,
  };
}

router.post("/", async (req, res) => {
  const resultado = validarInvestigacao(req.body);

  if (!resultado.ok) {
    return res.status(400).json({ erros: resultado.erros });
  }

  try {
    const filtros = montarFiltrosRawg(resultado.dados);
    const resposta = await rawgGet("/games", filtros);
    const candidatos = resposta.results.map(formatarCandidato);

    res.json({ total: resposta.count, candidatos });
  } catch (erro) {
    console.error("Erro ao consultar a RAWG:", erro.message);
    res
      .status(502)
      .json({ erro: "Nao foi possivel consultar a base de jogos agora." });
  }
});

export default router;
