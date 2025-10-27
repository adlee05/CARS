import { Request, Response } from "express";

const ArticleRedirect = async (req: Request, res: Response): Promise<void> => {
  try {
    const { article_id } = req.body;
    const userId = req.user.id;
    const pid = parseInt(article_id);
    if (!pid || typeof pid !== "number") {
      res.status(400).json({ error: "Valid article_id is required" });
      return;
    }
    const article = await req.db.fetchArticle(pid);
    if (!article) {
      res.status(404).json({ error: "Article not found" });
      return;
    }
    await req.db.recordInteraction(userId, pid, "click");
    res.status(200).json({ url: article.url });
  } catch (error: unknown) {
    console.error("Error in article redirect route:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      error: "Internal server error",
      details: errorMessage,
    });
  }
};

export default ArticleRedirect;
