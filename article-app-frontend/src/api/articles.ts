export interface Article {
  slug: string;
  title: string;
  summary: string;
  published_at: string;
  content?: string;
  channel_name?: string;
  channel_slug?: string;
  analyst_name?: string;
  analyst_slug?: string;
  analyst_avatar?: string;
  content_type_id?: number;
  content_type_name?: string;
  content_type_color?: string;
  regions?: string;
  message?: string;
}

export interface Filters {
  analyst?: string;
  channel?: string;
  contentType?: number;
  region?: string;
  page?: number;
  limit?: number;
}

export interface ArticlesResponse {
  articles: Article[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function fetchArticles(
  filters: Filters
): Promise<ArticlesResponse> {
  const params = new URLSearchParams();

  // Add filters to query parameters
  if (filters.analyst) params.append("analyst", filters.analyst);
  if (filters.channel) params.append("channel", filters.channel);
  if (filters.contentType !== undefined) {
    params.append("contentType", filters.contentType.toString());
  }
  if (filters.region) params.append("region", filters.region);
  if (filters.page !== undefined)
    params.append("page", filters.page.toString());
  if (filters.limit !== undefined)
    params.append("limit", filters.limit.toString());

  const res = await fetch(`/api/articles?${params.toString()}`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch articles");
  return res.json();
}

export async function fetchArticleBySlug(slug: string): Promise<Article> {
  const res = await fetch(`/api/articles/${slug}`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch article");
  return res.json();
}
