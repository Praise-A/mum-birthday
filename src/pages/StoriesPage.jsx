import { useEffect, useState } from "react";

import CollectionPage from "@/components/CollectionPage.jsx";
import { stories as fallbackStories } from "@/data/siteContent.js";
import { fetchStoriesContent } from "@/lib/sanity/content.js";

import "./StoriesPage.css";

function getBlockText(block) {
  if (!Array.isArray(block?.children)) {
    return "";
  }

  return block.children
    .map((child) => child.text || "")
    .join("")
    .trim();
}

function renderStoryBody(blocks) {
  return blocks
    .map((block, index) => {
      const text = getBlockText(block);
      if (!text) {
        return null;
      }

      if (block.listItem === "bullet") {
        return (
          <p
            key={`bullet-${index}`}
            className="story-article__body story-article__body--list"
          >
            {`• ${text}`}
          </p>
        );
      }

      if (block.style === "h2") {
        return (
          <h4 key={`h2-${index}`} className="story-article__subheading">
            {text}
          </h4>
        );
      }

      if (block.style === "blockquote") {
        return (
          <blockquote
            key={`quote-${index}`}
            className="story-article__inline-quote"
          >
            {text}
          </blockquote>
        );
      }

      return (
        <p key={`p-${index}`} className="story-article__body">
          {text}
        </p>
      );
    })
    .filter(Boolean);
}

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
        <article
          key={story.slug}
          className="paper-card content-card story-article"
        >
          <header className="story-article__header">
            <p className="content-tag">{story.tag}</p>
            <h3 className="content-title">{story.title}</h3>
          </header>

          {/* <p className="content-body story-article__excerpt">{story.excerpt}</p> */}

          {story.pullQuote && (
            <blockquote className="content-quote story-article__pull-quote">
              {story.pullQuote}
            </blockquote>
          )}

          <div className="story-article__body-wrap">
            {story.body.length ? (
              renderStoryBody(story.body)
            ) : (
              <p className="story-article__body">{story.excerpt}</p>
            )}
          </div>
        </article>
      ))}
    </CollectionPage>
  );
}
