// src/services/rawg.js
// Toda comunicacao com a API da RAWG passa por aqui 

const RAWG_BASE = "https://api.rawg.io/api";

function montarUrl(caminho, params = {}) {
  const url = new URL(RAWG_BASE + caminho);
  url.searchParams.set("key", process.env.RAWG_API_KEY);

  for (const [nome, valor] of Object.entries(params)) {
    if (valor !== undefined && valor !== null && valor !== "") {
      url.searchParams.set(nome, valor);
    }
  }

  return url;
}

export async function rawgGet(caminho, params) {
  const url = montarUrl(caminho, params);
  const resposta = await fetch(url);

  if (!resposta.ok) {
    throw new Error(`RAWG respondeu com status ${resposta.status}`);
  }

  return resposta.json();
}
