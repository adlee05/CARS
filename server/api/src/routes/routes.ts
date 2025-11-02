import express, { Request, Response } from "express";
const router = express.Router();
import FindSimilar from "./find_similar";
import Recommend from "./recommend";
import GetNews from "./serve_news";
import ArticleRedirect from "./article_redirect";
import { Login, Register } from "./auth";

router.get("/find-similar-article/:id", FindSimilar);
router.get("/recommend/", Recommend);
router.get("/news/", GetNews);
router.post("/article-redirect", ArticleRedirect);

router.post("/register", Register);
router.post("/login", Login);

export default router;
