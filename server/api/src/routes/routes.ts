import express, { Request, Response } from "express";
const router = express.Router();
import FindSimilar from "./find_similar";
import Recommend from "./recommend";
import GetNews, { GetNewsByRegion } from "./serve_news";
import ArticleRedirect from "./article_redirect";
import GetArticle from "./get_article";
import { Login, Register } from "./auth";

router.get("/find-similar-article/:id", FindSimilar);
router.get("/recommend/", Recommend);
router.get("/news/", GetNews);
router.get("/news4u", GetNewsByRegion);
router.get("/article/:id", GetArticle);
router.post("/article-redirect", ArticleRedirect);

router.post("/register", Register);
router.post("/login", Login);

export default router;
