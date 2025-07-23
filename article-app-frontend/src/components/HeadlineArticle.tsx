import { Link } from "react-router-dom";
import type { Article } from "../api/articles";
import { formatArticleDate } from "../utils/formatDate";

interface Props {
  article: Article;
}

export default function HeadlineArticle({ article }: Props) {
  return (
    <Link
      to={`/article/${article.slug}`}
      className="block bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 mb-12"
    >
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="flex-shrink-0 w-full md:w-1/2">
          <img
            src="/sample-headline.jpg"
            alt="Oil tower under gray sky"
            className="w-full h-96 md:h-full object-cover rounded-lg"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={`https://i.pravatar.cc/100?u=sample${article.analyst_slug}`}
              alt={article.analyst_name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="text-sm text-gray-700">{article.analyst_name}</p>
              <p className="text-xs text-gray-500">
                {formatArticleDate(article.published_at)}
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            {article.title}
          </h2>
          <p className="text-gray-700 text-sm">{article.summary}</p>
          <div className="mt-2 text-xs font-semibold text-yellow-600 uppercase">
            Breaking News
          </div>
        </div>
      </div>
    </Link>
  );
}
