import { useEffect, useState } from "react";

import CollectionPage from "@/components/CollectionPage.jsx";
import { stories as fallbackStories } from "@/data/siteContent.js";
import { fetchStoriesContent } from "@/lib/sanity/content.js";

export default function StoriesPage() {
  const [stories, setStories] = useState(fallbackStories);

  useEffect(() => {
    let alive = true;

    fetchStoriesContent().then((items) => {
      if (alive) {
        setStories(items);
      }
    });

    return () => {
      alive = false;
    };
  }, []);

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
