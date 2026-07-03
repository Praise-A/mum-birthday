import { useEffect, useState } from "react";
import { X, ZoomIn } from "lucide-react";

import CollectionPage from "@/components/CollectionPage.jsx";
import { galleryItems as fallbackGalleryItems } from "@/data/siteContent.js";
import { fetchGalleryContent } from "@/lib/sanity/content.js";

import "./GalleryPage.css";

export default function GalleryPage() {
  const [activeImage, setActiveImage] = useState(null);
  const [galleryItems, setGalleryItems] = useState(fallbackGalleryItems);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") setActiveImage(null);
    }

    if (activeImage) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImage]);

  useEffect(() => {
    let alive = true;

    fetchGalleryContent().then((items) => {
      if (alive) {
        setGalleryItems(items);
      }
    });

    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <CollectionPage
        eyebrow="Portrait gallery"
        title="Fifty years of beautiful moments"
        description="Portraits, candid shots, and family memories — every photo here is a piece of her story. Click any image to view it in full."
        ctaLabel="Add a tribute"
        ctaTo="/tributes"
      >
        {galleryItems.map((item) => (
          <article
            key={item.title}
            className="paper-card gallery-card"
            onClick={() => setActiveImage(item)}
          >
            <div className="gallery-card__image-wrap">
              <img
                className="gallery-card__image"
                src={item.image}
                alt={item.title}
                loading="lazy"
              />
              <div className="gallery-card__overlay">
                <ZoomIn className="icon-md" />
                <span>View fullscreen</span>
              </div>
            </div>
            <div className="gallery-card__body">
              <h3 className="content-title">{item.title}</h3>
              <p className="content-body">{item.caption}</p>
            </div>
          </article>
        ))}
      </CollectionPage>

      {activeImage && (
        <div className="lightbox-overlay" onClick={() => setActiveImage(null)}>
          <button
            className="lightbox-close"
            onClick={(e) => {
              e.stopPropagation();
              setActiveImage(null);
            }}
            aria-label="Close"
          >
            <X className="icon-md" />
          </button>
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="lightbox-image-wrap">
              <img
                className="lightbox-image"
                src={activeImage.image}
                alt={activeImage.title}
              />
            </div>
            <div className="lightbox-details">
              <p className="content-tag">Portrait gallery</p>
              <h3 className="lightbox-title">{activeImage.title}</h3>
              <p className="lightbox-caption">{activeImage.caption}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
