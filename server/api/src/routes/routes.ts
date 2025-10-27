import express, { Request, Response } from "express";
const router = express.Router();
import FindSimilar from "./find_similar";
import Recommend from "./recommend";
import GetNews from "./serve_news";
import ArticleRedirect from "./article_redirect";

router.get("/find-similar-article/:id", FindSimilar);
router.get("/recommend/", Recommend);
router.get("/news/", GetNews);
router.post("/article-redirect", ArticleRedirect);

export default router;
