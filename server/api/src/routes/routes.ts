import express, { Request, Response } from "express";
const router = express.Router();
import FindSimilar from "./find_similar";

router.get("/find-similar-article", FindSimilar);

export default router;
