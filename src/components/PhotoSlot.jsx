import { ImagePlus } from "lucide-react";
import { useState } from "react";
import "./PhotoSlot.css";

export default function PhotoSlot({
  title,
  caption,
  src,
  aspect = "portrait",
}) {
  const [missing, setMissing] = useState(false);

  return (
    <article className={`photo-slot photo-slot--${aspect}`}>
      <div className="photo-slot__image-wrap">
        {!missing ? (
          <img
            className="photo-slot__image"
            src={src}
            alt={title}
            loading="lazy"
            onError={() => setMissing(true)}
          />
        ) : (
          <div className="photo-slot__placeholder">
            <ImagePlus className="icon-md" />
            <p>{title}</p>
            <span>Add celebrant photo later</span>
          </div>
        )}
      </div>
      <div className="photo-slot__body">
        <h3>{title}</h3>
        <p>{caption}</p>
      </div>
    </article>
  );
}
