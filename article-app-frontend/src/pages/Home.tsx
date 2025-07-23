import { useEffect, useState } from "react";
import { fetchArticles, type Article } from "../api/articles";
import { fetchAnalysts, type Analyst } from "../api/filters";
import ArticleCard from "../components/ArticleCard";
import HeadlineArticle from "../components/HeadlineArticle";
import Filters from "../components/Filters";
import { formatArticleDate } from "../utils/formatDate";

interface FiltersState {
  analyst?: string;
  channel?: string;
  region?: string;
  page?: number;
  limit?: number;
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FiltersState>({ page: 1, limit: 9 });
  const [totalPages, setTotalPages] = useState(1);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [headlineArticle, setHeadlineArticle] = useState<Article | null>(null);
  const [analysts, setAnalysts] = useState<Analyst[]>([]);

  useEffect(() => {
    async function loadArticles() {
      setLoading(true);
      try {
        const data = await fetchArticles(filters);
        setArticles(data.articles);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, [filters]);

  useEffect(() => {
    async function loadLatest() {
      try {
        const data = await fetchArticles({ page: 1, limit: 5 });
        const breakingHeadline = data.articles.find(
          (article: Article) => article.content_type_name === "Breaking News"
        );
        // Set headline article to latest breaking news if available
        setHeadlineArticle(breakingHeadline || null);
        // Set latest articles excluding the headline article
        setLatestArticles(data.articles);
      } catch (err) {
        console.error("Error fetching latest articles:", err);
      }
    }

    async function loadAnalysts() {
      try {
        const data = await fetchAnalysts();
        setAnalysts(data);
      } catch (err) {
        console.error("Error fetching analysts:", err);
      }
    }

    loadLatest();
    loadAnalysts();
  }, []);

  function goToPage(page: number) {
    if (page < 1 || page > totalPages) return;
    setFilters((prev) => ({ ...prev, page }));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-10">
        <Filters
          filters={{ channel: filters.channel }}
          setFilters={(updated) =>
            setFilters((prev) => ({ ...prev, ...updated }))
          }
        />
      </div>

      <div className="border-t border-gray-300 mb-10"></div>

      <div className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold text-red-800 mb-2">
          Latest Insights & Articles
        </h1>
        <p className="text-lg text-gray-600">
          Curated analysis from our experts across industries
        </p>
      </div>

      <div className="mb-10 flex justify-start gap-2">
        <label className="text-sm font-medium pt-1">Filter by analyst:</label>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={filters.analyst || ""}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              analyst: e.target.value || undefined,
            }))
          }
        >
          <option value="">All Analysts</option>
          {analysts.map((analyst) => (
            <option key={analyst.slug} value={analyst.slug}>
              {analyst.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : articles.length === 0 ? (
            <p className="text-center text-gray-500">No articles found.</p>
          ) : (
            <>
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-2">
                {!filters.channel && headlineArticle && (
                  <div className="col-span-full">
                    <HeadlineArticle article={headlineArticle} />
                  </div>
                )}
                {articles
                  .filter((article) => article.slug !== headlineArticle?.slug)
                  .map((article) => (
                    <ArticleCard key={article.slug} article={article} />
                  ))}
              </div>

              <div className="mt-6 flex justify-center gap-2">
                <button
                  onClick={() => goToPage(filters.page! - 1)}
                  disabled={filters.page === 1}
                  className={`px-3 py-1 border rounded disabled:opacity-50 ${
                    filters.page !== 1 ? "cursor-pointer" : ""
                  }`}
                >
                  Prev
                </button>
                <span className="px-3 py-1 border rounded">
                  Page {filters.page} of {totalPages}
                </span>
                <button
                  onClick={() => goToPage(filters.page! + 1)}
                  disabled={filters.page === totalPages}
                  className={`px-3 py-1 border rounded disabled:opacity-50 ${
                    filters.page !== totalPages ? "cursor-pointer" : ""
                  }`}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>

        <aside className="hidden lg:block w-80 bg-white border border-gray-200 rounded-md p-6 ml-8">
          <h2 className="text-2xl font-extrabold mb-6 border-b border-gray-300 pb-2">
            Latest
          </h2>
          <ul>
            {latestArticles.map((article, idx) => (
              <li
                key={article.slug}
                className={`py-4 ${
                  idx < latestArticles.length - 1
                    ? "border-b border-gray-200"
                    : ""
                }`}
              >
                <a
                  href={`/articles/${article.slug}`}
                  className="block text-gray-900 font-semibold hover:text-yellow-500 transition"
                >
                  {article.title}
                </a>
                <p className="text-sm text-gray-600 mt-1">
                  {formatArticleDate(article.published_at)}
                </p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
