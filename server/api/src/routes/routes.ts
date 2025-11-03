import express, { Request, Response } from "express";
const router = express.Router();
import FindSimilar from "./find_similar";
import News4U from "./news4u";
import GetNews from "./serve_news";
import ArticleRedirect from "./article_redirect";
import GetArticle from "./get_article";
import { Login, Register } from "./auth";

router.get("/news4u", News4U);
router.get("/find-similar-article/:id", FindSimilar);
router.get("/news/", GetNews);
router.get("/article/:id", GetArticle);
router.post("/article-redirect", ArticleRedirect);

router.post("/register", Register);
router.post("/login", Login);

export default router;
