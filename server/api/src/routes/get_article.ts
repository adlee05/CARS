import { Request, Response } from "express";

const GetArticle = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params; // Use params to access URL parameters (not req.article_id)

  if (!id) {
    res.status(400).json({ message: "Article ID is required" });
    return;
  }

  try {
    const article = await req.db.fetchArticle(Number(id));

    if (!article) {
      res.status(404).json({ message: "Article not found" });
      return;
    }

    res.status(200).json(article); // Return the article data
  } catch (err) {
    console.error(
      "Error fetching article:",
      err instanceof Error ? err.stack : err,
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

export default GetArticle;
