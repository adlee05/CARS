import express, { Request, Response } from "express";
const router = express.Router();
import FindSimilar from "./find_similar";
import Recommend from "./recommend";

router.get("/find-similar-article/:id", FindSimilar);
router.get("/recommend/", Recommend);

export default router;
