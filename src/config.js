export const APP = {
  name: "REBOBIT",
  tagline: "Rebobine a fita e encontre aquele jogo",
  rawgAttribution: "Dados de jogos fornecidos por RAWG",
  rawgUrl: "https://rawg.io",
};

export const PLATAFORMAS = [
  { id: "snes", rawgId: 79, nome: "Super Nintendo" },
  { id: "megadrive", rawgId: 167, nome: "Mega Drive" },
  { id: "n64", rawgId: 83, nome: "Nintendo 64" },
  { id: "ps1", rawgId: 27, nome: "PlayStation 1" },
];

export const GENEROS = [
  { id: "plataforma", rawgSlug: "platformer", nome: "Plataforma" },
  { id: "acao", rawgSlug: "action", nome: "Acao" },
  { id: "aventura", rawgSlug: "adventure", nome: "Aventura" },
  { id: "rpg", rawgSlug: "role-playing-games-rpg", nome: "RPG" },
  { id: "luta", rawgSlug: "fighting", nome: "Luta" },
  { id: "tiro", rawgSlug: "shooter", nome: "Tiro" },
  { id: "corrida", rawgSlug: "racing", nome: "Corrida" },
  { id: "esporte", rawgSlug: "sports", nome: "Esporte" },
  { id: "estrategia", rawgSlug: "strategy", nome: "Estrategia" },
  { id: "puzzle", rawgSlug: "puzzle", nome: "Quebra-cabeca" },
];

export const CENARIOS = [
  {
    id: "floresta",
    nome: "Floresta ou natureza",
    slugs: ["forest", "jungle", "nature"],
  },
  {
    id: "espaco",
    nome: "Espaco ou ficcao cientifica",
    slugs: ["space", "sci-fi"],
  },
  {
    id: "medieval",
    nome: "Medieval ou castelos",
    slugs: ["medieval", "castle"],
  },
  { id: "cidade", nome: "Cidade ou ruas", slugs: ["city", "open-world"] },
  {
    id: "terror",
    nome: "Terror ou sobrenatural",
    slugs: ["horror", "zombies"],
  },
  { id: "guerra", nome: "Guerra ou militar", slugs: ["war", "military"] },
  { id: "esporte", nome: "Esporte", slugs: ["sports"] },
  { id: "fantasia", nome: "Fantasia ou magia", slugs: ["fantasy"] },
  { id: "nao_lembro", nome: "Nao lembro", slugs: [] },
];
