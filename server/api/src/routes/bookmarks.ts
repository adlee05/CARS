import { Router, Request, Response } from "express";
import { supabase } from "../utils/supabase";

const router = Router();

router.get("/bookmarks", async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  if (!userId) return res.sendStatus(401);

  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  return res.json(data);
});

router.post("/bookmarks", async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  if (!userId) return res.sendStatus(401);

  const { article_id, url, title, image, region, published_date } = req.body || {};
  if (!url && !article_id) {
    return res.status(400).json({ error: "url or article_id required" });
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .insert({
      user_id: userId,
      article_id: article_id?.toString?.(),
      url,
      title,
      image,
      region,
      published_date,
    })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  return res.json(data);
});

router.delete("/bookmarks/:id", async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  if (!userId) return res.sendStatus(401);

  const { id } = req.params;
  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) return res.status(400).json({ error: error.message });
  return res.sendStatus(204);
});

export default router;




