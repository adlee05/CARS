import { Request, Response } from "express";

const Recommend = async (req: Request, res: Response): Promise<void> => {
  const id = req.user.id;
  if (!id) {
    res.status(400).send("Bad Request: ID should be a valid number");
  }

  try {
    const history_list = await req.db.getClickedArticleEmbeddings(req.user.id);
    if (history_list.size < 1) {
      res.status(400).json({ msg: `cold start is not handled yet` });
    } else {
      const embedding_array = Array.from(history_list.values());
      const user_repr = await req.service.inferUser({
        embeddings: embedding_array,
        embeddingDims: [embedding_array.length, 768],
      });
      const similar_articles = await req.db.fetchSimilarArticles(
        [...user_repr.data] as number[],
        10,
      );

      res.status(200).json(similar_articles);
    }
  } catch (error: unknown) {
    console.error("Error in /recommend route:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    (res.status(500) as any).json({
      error: "Internal server error",
      details: errorMessage,
    });
  }
};

const GetNewsByRegion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { region } = req.query;

    if (!region || typeof region !== "string") {
      res.status(400).json({ error: "Region must be a valid string" });
      return;
    }
    const articles = await req.db.fetchArticlesByRegion(region, 18);
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

const FakeRecommend = async (req: Request, res: Response): Promise<void> => {
  if (!req.user || !req.user.id) {
    res.status(400).send("Bad Request: ID should be a valid number");
    return;
  }
  const id = req.user.id;
  try {
    const history_list = await req.db.getLastClickedArticleEmbedding(
      req.user.id,
    );
    const similar_articles = await req.db.fetchSimilarArticles(
      history_list || [],
      15,
    );
    res.status(200).json(similar_articles);
  } catch (error: unknown) {
    console.error("Error in /recommend route:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    (res.status(500) as any).json({
      error: "Internal server error",
      details: errorMessage,
    });
  }
};

const News4U = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      res.status(400).json({ error: "Bad Request: User ID is required" });
      return;
    }
    const history_list = await req.db.getLastClickedArticleEmbedding(
      req.user.id,
    );
    if (!history_list || history_list.length < 1) {
      return await GetNewsByRegion(req, res);
    }
    return await FakeRecommend(req, res);
  } catch (error: unknown) {
    console.error("Error in News4U route:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      error: "Internal server error",
      details: errorMessage,
    });
  }
};
export default News4U;
