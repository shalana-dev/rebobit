// server.js
// Ponto de entrada do REBOBIT. Liga o servidor que vai servir o site e a API.

import "dotenv/config";
import express from "express";
import helmet from "helmet";
import { APP } from "./src/config.js";
import { rawgGet } from "./src/services/rawg.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(helmet());
app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.type("text/plain").send(`${APP.name} no ar`);
});

app.get("/api/health", (req, res) => {
  res.json({
    app: APP.name,
    status: "ok",
    time: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`${APP.name} rodando em http://localhost:${PORT}`);
  console.log(
    `Chave da RAWG carregada: ${process.env.RAWG_API_KEY ? "sim" : "NAO"}`,
  );
});
