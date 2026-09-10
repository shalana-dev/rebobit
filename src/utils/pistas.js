// duas estruturas para interpretar a lembranca livre, + a funcao de pontos.

// 1 -> Traducoes genericas: uma palavra em portugues aponta para termos em ingles
//    que podem aparecer no titulo de um jogo, sendo assim, cada chave é um conceito

export const TRADUCOES = {
  minhoca: ["worm"],
  verme: ["worm"],
  espada: ["sword", "blade"],
  escudo: ["shield"],
  dragao: ["dragon"],
  dinossauro: ["dino", "dinosaur", "saurus"],
  tartaruga: ["turtle"],
  fantasma: ["ghost"],
  robo: ["robot", "mech"],
  nave: ["star", "galaxy"],
  carro: ["racing", "turbo", "drift"],
  bomba: ["bomberman", "bomb"],
  ninja: ["ninja", "shinobi"],
  pirata: ["pirate"],
  zumbi: ["zombie"],
  vampiro: ["vampire", "castlevania"],
  princesa: ["princess"],
  demonio: ["demon", "doom"],
  esqueleto: ["skeleton", "skull"],
  mago: ["wizard", "mage"],
  rei: ["king"],
};

// 2-> combinacoes retro: quando TODAS as palavras de "quando" aparecem na
//    lembranca, procuramos os termos de "procurar" no titulo do jogo.

export const COMBINACOES = [
  { quando: ["ourico", "azul"], procurar: ["sonic", "hedgehog"] },
  { quando: ["macaco", "barril"], procurar: ["donkey", "kong"] },
  { quando: ["macaco", "gravata"], procurar: ["donkey", "kong"] },
  { quando: ["cacadora", "espacial"], procurar: ["samus", "metroid"] },
  { quando: ["cacadora", "espaco"], procurar: ["samus", "metroid"] },
  { quando: ["encanador", "bigode"], procurar: ["mario"] },
  { quando: ["menino", "verde", "espada"], procurar: ["zelda", "link"] },
  { quando: ["elfo", "espada"], procurar: ["zelda", "link"] },
  { quando: ["dinossauro", "verde"], procurar: ["yoshi"] },
  { quando: ["tartaruga", "ninja"], procurar: ["turtles"] },
];

function normalizarTexto(texto) {
  return (texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function palavrasDe(texto) {
  return normalizarTexto(texto)
    .split(" ")
    .filter((palavra) => palavra.length > 2);
}

export function pontosDaLembranca(lembranca, tituloDoJogo) {
  if (!lembranca) {
    return { pontos: 0, conceitos: [] };
  }

  const palavras = palavrasDe(lembranca);
  const titulo = normalizarTexto(tituloDoJogo);
  const conceitos = [];

  for (const combo of COMBINACOES) {
    const todasPresentes = combo.quando.every((p) => palavras.includes(p));
    const tituloBate = combo.procurar.some((termo) => titulo.includes(termo));
    if (todasPresentes && tituloBate) {
      conceitos.push(combo.quando.join("+"));
    }
  }

  for (const palavra of palavras) {
    const alvos = TRADUCOES[palavra];
    if (alvos && alvos.some((termo) => titulo.includes(termo))) {
      conceitos.push(palavra);
    }
  }

  const unicos = [...new Set(conceitos)];
  const pontos = Math.min(unicos.length * 5, 15);
  return { pontos, conceitos: unicos };
}
