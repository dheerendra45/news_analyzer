import { format } from "date-fns";
import { FileText, Download, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ReportCard = ({ report, onReadMore }) => {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <article className="card group overflow-hidden">
      {/* Cover Image */}
      {report.cover_image_url && (
        <div className="h-48 overflow-hidden">
          <img
            src={report.cover_image_url}
            alt={report.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      {/* Card Content */}
      <div className="p-7">
        {/* Meta */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-crimson" />
            <span className="font-inter text-xs font-semibold uppercase tracking-wide text-crimson">
              Research Report
            </span>
          </div>
          <span className="font-inter text-xs text-mist">
            {formatDate(report.published_date)}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-playfair text-xl leading-tight mb-3 text-black group-hover:text-crimson transition-colors">
          {report.title}
        </h3>

        {/* Author & Reading Time */}
        <div className="flex items-center gap-4 mb-4 text-gray-500">
          {report.author && (
            <span className="font-inter text-xs">By {report.author}</span>
          )}
          {report.reading_time && (
            <span className="font-inter text-xs flex items-center gap-1">
              <Clock size={12} />
              {report.reading_time} min read
            </span>
          )}
        </div>

        {/* Summary */}
        <p className="font-crimson text-base text-charcoal leading-relaxed mb-5 line-clamp-3">
          {report.summary}
        </p>

        {/* Tags */}
        {report.tags && report.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {report.tags.slice(0, 4).map((tag, index) => (
              <span
                key={index}
                className="font-inter text-[10px] px-2 py-1 bg-[#f4f5f3] text-charcoal"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {/* Always show Read More link */}
          <Link
            to={`/report/${report.id || report._id}`}
            className="btn btn-secondary flex-1 justify-center"
          >
            Read More
            <ArrowRight size={14} />
          </Link>
          {report.pdf_url && (
            <a
              href={report.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary flex-1 justify-center"
            >
              <Download size={14} />
              PDF
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export default ReportCard;
