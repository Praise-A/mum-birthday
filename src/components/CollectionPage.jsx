import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import SectionTitle from "@/components/SectionTitle.jsx";

import "./CollectionPage.css";

export default function CollectionPage({
  eyebrow,
  title,
  description,
  note,
  ctaLabel = "Leave a tribute",
  ctaTo = "/tributes",
  className = "",
  children,
}) {
  return (
    <section className={`collection-page ${className}`.trim()}>
      <div className="collection-hero">
        <div className="paper-card collection-hero__main">
          <SectionTitle
            eyebrow={eyebrow}
            title={title}
            description={description}
          />
        </div>

        {note && (
          <aside className="paper-card collection-note">
            <p>{note}</p>
            <Link to={ctaTo} className="collection-note__link">
              {ctaLabel}
              <ArrowRight className="icon-xs" />
            </Link>
          </aside>
        )}
      </div>

      <div className="collection-grid">{children}</div>
    </section>
  );
}
