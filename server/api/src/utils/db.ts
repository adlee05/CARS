import { Client, QueryResult } from "pg";

interface Article {
  id: number;
  title: string;
  content: string;
  url: string;
  source: string;
  image: string;
  region: string;
  published_date: string;
}

class Database {
  private client: Client;

  constructor() {
    this.client = new Client();
  }
  async connect(): Promise<void> {
    await this.client.connect();
  }
  async disconnect(): Promise<void> {
    await this.client.end();
  }

  // In your Database class
  async fetchArticlesByRegion(
    region: string,
    limit: number,
  ): Promise<Article[]> {
    try {
      const res: QueryResult = await this.client.query(
        // ✅ CORRECT - Add region filter
        `SELECT id, title, content, url, source, region, published_date, top_image 
 FROM articles 
 WHERE region = $1 AND published_date >= NOW() - INTERVAL '1 day' * $2
 ORDER BY RANDOM()
 LIMIT $3;`,
        [region, 30, limit], // All 3 parameters used
      );

      return res.rows.map((row) => ({
        id: row.id,
        title: row.title,
        content: row.content,
        url: row.url,
        source: row.source,
        region: row.region,
        published_date: row.published_date,
        image: row.top_image,
      }));
    } catch (err) {
      console.error("Error fetching articles by region:", err);
      throw err;
    }
  }

  async fetchArticle(articleId: number): Promise<Article | null> {
    try {
      const res: QueryResult = await this.client.query(
        "SELECT id, title, content, url, source, region, published_date, top_image FROM articles WHERE id=$1;",
        [articleId],
      );
      if (res.rows.length === 0) {
        return null;
      }

      const row = res.rows[0];
      return {
        id: row.id,
        title: row.title,
        content: row.content,
        url: row.url,
        source: row.source,
        region: row.region,
        image: row.top_image,
        published_date: row.published_date,
      };
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error fetching article:", err.stack);
      } else {
        console.error("Unknown error occurred:", err);
      }

      throw err;
    }
  }
  async resetSchema(schema_sql: string): Promise<void> {
    try {
      await this.client.query(schema_sql);
      console.log("✅ Schema dropped and recreated successfully!");
    } catch (e) {
      console.error("❌ Error:", e);
    }
  }

  async fetchTopKArticles(k: number, daysOld: number = 7): Promise<Article[]> {
    try {
      const res: QueryResult = await this.client.query(
        `SELECT id, title, content, url, source, region, published_date, top_image 
       FROM articles 
       WHERE published_date >= NOW() - INTERVAL '1 day' * $2
       ORDER BY RANDOM()
       LIMIT $1;`,
        [k, daysOld],
      );

      if (res.rows.length === 0) {
        return [];
      }

      return res.rows.map((row) => ({
        id: row.id,
        title: row.title,
        content: row.content,
        url: row.url,
        source: row.source,
        region: row.region,
        published_date: row.published_date,
        image: row.top_image,
      }));
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error fetching top articles:", err.stack);
      } else {
        console.error("Unknown error occurred:", err);
      }
      throw err;
    }
  }

  async fetchSimilarArticles(
    queryEmbedding: number[],
    k: number = 10,
  ): Promise<any[]> {
    try {
      if (queryEmbedding.length == 0) {
        return [];
      }
      const embeddingStr = `[${queryEmbedding.join(",")}]`;
      const sql = `
        SELECT a.id, a.title, a.content, a.url, a.source, a.region, a.published_date, a.top_image,
            1 - (ae.embedding <=> $1::vector) AS cosine_similarity
        FROM article_embeddings ae
        JOIN articles a ON ae.article_id = a.id
        ORDER BY 1 - (ae.embedding <=> $1::vector) DESC
        LIMIT $2;
      `;
      const res: QueryResult = await this.client.query(sql, [embeddingStr, k]);

      return res.rows.map((row) => ({
        id: row.id,
        title: row.title,
        url: row.url,
        source: row.source,
        region: row.region,
        published_date: row.published_date,
        image: row.top_image,
        similarity: row.cosine_similarity,
      }));
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error fetching article embedding:", err.stack);
      } else {
        console.error("Unknown error occurred:", err);
      }
      throw err;
    }
  }

  async getArticleEmbedding(articleId: number): Promise<number[] | null> {
    try {
      const sql =
        "SELECT embedding FROM article_embeddings WHERE article_id = $1;";
      const res: QueryResult = await this.client.query(sql, [articleId]);

      if (res.rows.length === 0) {
        console.warn(`⚠️ No embedding found for article_id ${articleId}`);
        return null;
      }

      const embeddingStr = res.rows[0].embedding;
      const embedding = embeddingStr
        .replace(/\[|\]/g, "")
        .split(",")
        .map((x: string) => parseFloat(x));

      return embedding;
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error fetching article embedding:", err.stack);
      } else {
        console.error("Unknown error occurred:", err);
      }
      throw err;
    }
  }
  async getArticleEmbeddings(
    articleIds: number[],
  ): Promise<Map<number, number[]>> {
    try {
      if (articleIds.length === 0) {
        return new Map();
      }
      const sql = `
      SELECT article_id, embedding 
      FROM article_embeddings 
      WHERE article_id = ANY($1);
    `;
      const res: QueryResult = await this.client.query(sql, [articleIds]);
      const embeddingsMap = new Map<number, number[]>();
      for (const row of res.rows) {
        const articleId = row.article_id;
        const embeddingStr = row.embedding;
        const embedding = embeddingStr
          .replace(/\[|\]/g, "")
          .split(",")
          .map((x: string) => parseFloat(x));
        embeddingsMap.set(parseInt(articleId), embedding);
      }
      const foundIds = new Set(embeddingsMap.keys());
      const missingIds = articleIds.filter((id) => !foundIds.has(id));
      if (missingIds.length > 0) {
        console.warn(
          `⚠️ No embeddings found for article_ids: ${missingIds.join(", ")}`,
        );
      }

      return embeddingsMap;
    } catch (err) {
      if (err instanceof Error) {
        console.error("error fetching article embeddings:", err.stack);
      } else {
        console.error("unknown error occurred:", err);
      }
      throw err;
    }
  }

  async getUserPasswordHash(userId: string) {
    try {
      const sql = "SELECT hash FROM public.user WHERE id = $1;";
      const res = await this.client.query(sql, [userId]);

      if (res.rows.length === 0) {
        return null;
      }
      return res.rows[0].hash;
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error fetching password hash:", err.stack);
      } else {
        console.error("unknown error occurred:", err);
      }
      throw err;
    }
  }

  async getClickedArticleEmbeddings(
    userId: string,
  ): Promise<Map<number, number[]>> {
    try {
      const sql = `
    SELECT ui.article_id, ae.embedding
    FROM public.user_interactions ui
    JOIN article_embeddings ae ON ui.article_id = ae.article_id
    WHERE ui.user_id = $1 AND ui.type = 'click'
    ORDER BY ui.timestamp ASC;
`;
      const res = await this.client.query(sql, [userId]);

      if (res.rows.length === 0) {
        return new Map(); // No clicked articles or no embeddings found
      }

      const embeddingsMap = new Map<number, number[]>();
      for (const row of res.rows) {
        const articleId = row.article_id;
        const embeddingStr = row.embedding;
        const embedding = embeddingStr
          .replace(/\[|\]/g, "")
          .split(",")
          .map((x: string) => parseFloat(x));
        embeddingsMap.set(articleId, embedding);
      }

      return embeddingsMap;
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error fetching clicked article embeddings:", err.stack);
      } else {
        console.error("Unknown error occurred:", err);
      }
      throw err;
    }
  }
  async getLastClickedArticleEmbedding(
    userId: string,
  ): Promise<number[] | null> {
    try {
      const sql = `
    SELECT ui.article_id, ae.embedding
    FROM public.user_interactions ui
    JOIN article_embeddings ae ON ui.article_id = ae.article_id
    WHERE ui.user_id = $1 AND ui.type = 'click'
    ORDER BY ui.timestamp ASC
    LIMIT 1;`;
      const res = await this.client.query(sql, [userId]);
      if (res.rows.length === 0) {
        return null;
      }

      const articleId = res.rows[0].article_id;
      const embeddingStr = res.rows[0].embedding;
      const embedding = embeddingStr
        .replace(/\[|\]/g, "")
        .split(",")
        .map((x: string) => parseFloat(x));
      return embedding;
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error fetching clicked article embeddings:", err.stack);
      } else {
        console.error("Unknown error occurred:", err);
      }
      throw err;
    }
  }
  async getClickedArticleIds(userId: string) {
    try {
      const sql = `
            SELECT article_id
            FROM public.user_interactions
            WHERE user_id = $1 AND type = 'click'
            ORDER BY timestamp ASC;
        `;
      const res = await this.client.query(sql, [userId]);
      return res.rows.map((row) => parseInt(row.article_id)); // Return an array of article IDs
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error fetching clicked article IDs:", err.stack);
      } else {
        console.error("unknown error occurred:", err);
      }
      throw err;
    }
  }

  async registerUser(
    id: string,
    email: string,
    role: string,
    username: string,
  ): Promise<void> {
    try {
      const sql = `
      INSERT INTO public.user (id, email, role, created_at, username)
      VALUES ($1, $2, $3, NOW(), $4)
    `;
      await this.client.query(sql, [id, email, role, username]);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error registering user:", err.stack);
      } else {
        console.error("Unknown error occurred:", err);
      }
      throw err;
    }
  }
  async recordInteraction(
    userId: string,
    articleId: number,
    interactionType: string,
  ): Promise<void> {
    try {
      const sql = `
        INSERT INTO public.user_interactions (user_id, article_id, type, timestamp)
        VALUES ($1, $2, $3, NOW())
      `;
      await this.client.query(sql, [userId, articleId, interactionType]);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error recording interaction:", err.stack);
      } else {
        console.error("Unknown error occurred:", err);
      }
      throw err;
    }
  }
}

export default Database;
