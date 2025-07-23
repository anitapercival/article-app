import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { fetchArticleBySlug, fetchArticles } from "../api/articles";
import type { Article } from "../api/articles";
import { formatArticleDate } from "../utils/formatDate";
import ArticleCard from "../components/ArticleCard";

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchArticleBySlug(slug)
      .then((data) => {
        setArticle(data);
        setLoading(false);
        console.log(data);
      })
      .catch(() => {
        setError("Failed to load article");
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    if (
      article?.content_type_id === undefined ||
      article?.content_type_id === null
    ) {
      console.log("No content_type_id, skipping related fetch");
      return;
    }

    console.log(
      "Fetching related articles for contentType ID:",
      article.content_type_id
    );

    // Fetch related articles based on content type
    setRelatedLoading(true);
    fetchArticles({
      contentType: article.content_type_id,
      limit: 4,
      page: 1,
    })
      .then((data) => {
        const filtered = data.articles.filter((a) => a.slug !== article.slug);
        setRelatedArticles(filtered.slice(0, 3));
        setRelatedLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch related articles:", err);
        setRelatedLoading(false);
      });
  }, [article]);

  if (loading) return <p>Loading article...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!article) return <p>Article not found.</p>;

  return (
    <article className="max-w-3xl mx-auto space-y-6 mt-12">
      <h1 className="text-4xl font-bold">{article.title}</h1>

      <div className="flex items-center space-x-4">
        {article.analyst_avatar && (
          <img
            src={`https://i.pravatar.cc/100?u=${article.analyst_slug}`}
            alt={article.analyst_name}
            className="w-12 h-12 rounded-full"
          />
        )}
        <div>
          <p className="font-semibold">{article.analyst_name}</p>
          <p className="text-sm text-gray-500">
            Published {formatArticleDate(article.published_at)}
          </p>
        </div>
      </div>

      <div className="prose max-w-none">
        {article.content ? (
          <p>{article.content}</p>
        ) : (
          <>
            <p>{article.summary}</p>
            {article.message && (
              <p className="text-gray-700 font-medium mt-4">
                {article.message}{" "}
                <Link
                  to="/login"
                  state={{ from: location }}
                  className="underline text-blue-500 hover:text-blue-700"
                >
                  Login
                </Link>
              </p>
            )}
          </>
        )}
      </div>

      <button
        className="mt-6 text-gray-600 hover:underline"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button>

      {relatedArticles.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">
            Articles You Might Also Like
          </h2>
          {relatedLoading ? (
            <p>Loading related articles...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <ArticleCard key={related.slug} article={related} />
              ))}
            </div>
          )}
        </section>
      )}
    </article>
  );
}
