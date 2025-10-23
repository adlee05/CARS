import { Request, Response } from "express";
const FindSimilar = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!id) {
    res.status(400).send("Bad Request: ID should be a valid number");
  }
  try {
    const embed = await req.db.getArticleEmbedding(parseInt(id));
    if (!embed) {
      res
        .status(404)
        .json({ msg: `article with id ${id} could not be found.` });
    } else {
      const result = await req.db.fetchSimilarArticles(embed);
      (res.status(200) as any).json(result);
    }
  } catch (error: unknown) {
    console.error("Error in /mock route:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    (res.status(500) as any).json({
      error: "Internal server error",
      details: errorMessage,
    });
  }
};

export default FindSimilar;
