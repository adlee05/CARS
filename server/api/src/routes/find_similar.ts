import express from "express";
const FindSimilar = async (req, res): Promise<void> => {
  try {
    const embed = await req.db.getArticleEmbeddings([381, 382, 383, 389]);
    const tmp = Array.from(embed.values());
    const projected = await req.service.inferUser({
      embeddings: tmp,
      embeddingDims: [tmp.length, 768],
    });
    console.log(projected);
    (res.status(200) as any).json({ a: tmp, b: tmp.length });
  } catch (error: unknown) {
    console.error("Error in /mock route:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    (res.status(500) as any).json({
      error: "Internal server error",
      details: errorMessage,
    });
  }
})

export default FindSimilar;
