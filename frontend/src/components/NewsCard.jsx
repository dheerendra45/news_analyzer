import { format } from "date-fns";

const NewsCard = ({ news, onGenerateReport, onMarkAnalyzed, onSkip }) => {
  const getTierColor = (tier) => {
    switch (tier) {
      case "tier_1":
        return "bg-crimson";
      case "tier_2":
        return "bg-gold";
      case "tier_3":
        return "bg-teal";
      default:
        return "bg-gray-400";
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "yyyy-MM-dd");
    } catch {
      return dateString;
    }
  };

  return (
    <article className="bg-white border border-platinum overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Tier Indicator */}
      <div className={`h-1 ${getTierColor(news.tier)}`}></div>

      {/* Card Content */}
      <div className="p-7">
        {/* Meta */}
        <div className="flex justify-between items-start mb-4">
          <span className="font-inter text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            {news.source || news.category}
          </span>
          <span className="font-inter text-[11px] text-mist">
            {formatDate(news.published_date)}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-playfair text-[22px] leading-tight mb-3 text-black">
          {news.title}
        </h3>

        {/* Summary */}
        <p className="font-crimson text-[15px] text-charcoal leading-relaxed mb-5">
          {news.summary || news.description}
        </p>

        {/* Stats */}
        {(news.key_stat?.value || news.secondary_stat?.value) && (
          <div className="flex gap-6 py-4 border-t border-b border-platinum mb-5">
            {news.key_stat?.value && (
              <div className="flex-1">
                <div className="font-playfair text-2xl text-crimson leading-none">
                  {news.key_stat.value}
                </div>
                <div className="font-inter text-[9px] uppercase tracking-wide text-gray-500 mt-1">
                  {news.key_stat.label}
                </div>
              </div>
            )}
            {news.secondary_stat?.value && (
              <div className="flex-1">
                <div className="font-playfair text-2xl text-crimson leading-none">
                  {news.secondary_stat.value}
                </div>
                <div className="font-inter text-[9px] uppercase tracking-wide text-gray-500 mt-1">
                  {news.secondary_stat.label}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {news.affected_roles?.slice(0, 2).map((role, index) => (
            <span
              key={`role-${index}`}
              className="font-inter text-[10px] px-2.5 py-1 bg-[#f4f5f3] text-charcoal border-l-2 border-crimson"
            >
              {role}
            </span>
          ))}
          {news.companies?.slice(0, 1).map((company, index) => (
            <span
              key={`company-${index}`}
              className="font-inter text-[10px] px-2.5 py-1 bg-[#f4f5f3] text-charcoal border-l-2 border-teal"
            >
              {company}
            </span>
          ))}
          {news.tags?.slice(0, 2).map((tag, index) => (
            <span
              key={`tag-${index}`}
              className="font-inter text-[10px] px-2.5 py-1 bg-[#f4f5f3] text-charcoal border-l-2 border-gold"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => onGenerateReport?.(news.id)}
            className="flex-1 font-inter text-[11px] font-semibold uppercase tracking-wide py-3 px-5 bg-crimson text-white border-none cursor-pointer transition-all hover:bg-deep-crimson"
          >
            View Details
          </button>
          {news.source_url && (
            <a
              href={news.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 font-inter text-[11px] font-semibold uppercase tracking-wide py-3 px-5 bg-white text-black border border-black cursor-pointer transition-all hover:bg-black hover:text-white text-center"
            >
              Source
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
