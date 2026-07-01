import CollectionPage from "@/components/CollectionPage.jsx";
import { stories } from "@/data/siteContent.js";

export default function StoriesPage() {
  return (
    <CollectionPage
      eyebrow="Blog archive"
      title="Stories and reflections in her honour"
      description="Family memories, reflections, and legacy notes written by the people who know her best. Read, remember, and add your own."
      ctaLabel="Write a tribute"
      ctaTo="/tributes"
    >
      {stories.map((story) => (
        <article key={story.slug} className="paper-card content-card">
          <p className="content-tag">{story.tag}</p>
          <h3 className="content-title">{story.title}</h3>
          <p className="content-body">{story.excerpt}</p>
          <blockquote className="content-quote">{story.pullQuote}</blockquote>
        </article>
      ))}
    </CollectionPage>
  );
}
