import express, { Request, Response } from "express";
const router = express.Router();
import FindSimilar from "./find_similar";
import Recommend from "./recommend";
import GetNews from "./serve_news";

router.get("/find-similar-article/:id", FindSimilar);
router.get("/recommend/", Recommend);
router.get("/news/", GetNews);

export default router;
