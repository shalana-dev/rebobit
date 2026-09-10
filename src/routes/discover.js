// src/routes/discover.js
// Rota que recebe as respostas da investigacao e devolve os candidatos.

import { Router } from "express";
import { validarInvestigacao } from "../utils/validacao.js";

const router = Router();

router.post("/", (req, res) => {
  const resultado = validarInvestigacao(req.body);

  if (!resultado.ok) {
    return res.status(400).json({ erros: resultado.erros });
  }

  res.json({ investigacao: resultado.dados });
});

export default router;
