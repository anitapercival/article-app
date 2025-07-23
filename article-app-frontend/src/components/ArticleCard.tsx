import { Link } from "react-router-dom";
import type { Article } from "../api/articles";
import { formatArticleDate } from "../utils/formatDate";

interface Props {
  article: Article;
}

export default function ArticleCard({ article }: Props) {
  return (
    <Link
      to={`/article/${article.slug}`}
      className="
        block
        bg-white
        shadow
        hover:shadow-lg
        transition-shadow
        duration-300
        overflow-hidden
        p-4 sm:p-5
        flex flex-col justify-between
        w-full sm:w-80 md:w-64 lg:w-full
      "
    >
      <div className="flex justify-between items-center mb-4 text-sm text-gray-700">
        <div className="flex items-center space-x-2">
          <img
            src={`https://i.pravatar.cc/100?u=sample${article.analyst_slug}`}
            alt={article.analyst_name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-medium">{article.analyst_name}</span>
        </div>
        <span className="text-xs text-gray-500">
          {formatArticleDate(article.published_at)}
        </span>
      </div>

      <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 mb-4 line-clamp-3 leading-snug">
        {article.title}
      </h2>

      <div className="flex items-center gap-2 text-xs font-semibold">
        {article.content_type_name && (
          <span className="text-yellow-600">{article.content_type_name}</span>
        )}

        <span className="text-gray-400">|</span>

        {article.regions && (
          <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
            {article.regions.split(",")[0].trim()}
          </span>
        )}
      </div>
    </Link>
  );
}
