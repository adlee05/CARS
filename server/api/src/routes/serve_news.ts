import { Request, Response } from "express";

const GetNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const articles = await req.db.fetchTopKArticles(15, 30);
    if (!articles || articles.length === 0) {
      res.status(404).json({ msg: "article database is empty" });
      return;
    }
    res.status(200).json(articles); // Respond with articles
  } catch (error: unknown) {
    console.error("Error in get news route:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      error: "Internal server error",
      details: errorMessage,
    });
  }
};

const GetNewsByRegion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { region } = req.query;

    // ✅ Check if region exists and is a string
    if (!region || typeof region !== "string") {
      res.status(400).json({ error: "Region must be a valid string" });
      return;
    }

    const articles = await req.db.fetchArticlesByRegion(region, 30); // ✅ Now region is definitely a string

    if (!articles) {
      res.status(404).json({ msg: "article database is empty" });
      return;
    }

    res.status(200).json(articles);
  } catch (error: unknown) {
    console.error("Error in get news route:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      error: "Internal server error",
      details: errorMessage,
    });
  }
};

export { GetNewsByRegion };
export default GetNews;
