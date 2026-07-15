import { useEffect, useMemo, useState } from "react";

import CollectionPage from "@/components/CollectionPage.jsx";
import { fallbackTributes } from "@/data/siteContent.js";
import { submitContribution } from "@/lib/api.js";
import { fetchApprovedTributesContent } from "@/lib/sanity/content.js";

import "./TributesPage.css";

const initialForm = {
  name: "",
  relationship: "",
  category: "Goodwill",
  message: "",
  photo: null,
};

export default function TributesPage() {
  const [approvedTributes, setApprovedTributes] = useState(fallbackTributes);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    fetchApprovedTributesContent()
      .then((items) => {
        if (items.length) {
          setApprovedTributes(items);
        }
      })
      .catch(() => {});
  }, []);

  const approvedCount = useMemo(
    () => approvedTributes.length,
    [approvedTributes],
  );

  function handleChange(event) {
    const { name, value, files } = event.target;
    setForm((current) => ({
      ...current,
      [name]: files ? files[0] : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setFeedback("");

    const payload = new FormData();
    payload.append("name", form.name);
    payload.append("relationship", form.relationship);
    payload.append("category", form.category);
    payload.append("message", form.message);
    if (form.photo) payload.append("photo", form.photo);

    try {
      const response = await submitContribution(payload);
      setFeedback(response.message);
      setForm(initialForm);
      event.target.reset();
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <CollectionPage
      eyebrow="Tributes"
      title="Leave her a message she will keep forever"
      description="Write a tribute, a birthday prayer, a memory, or a wish. Every message is reviewed and then added to the wall she will read on November 12th."
      ctaLabel="Write a tribute"
      ctaTo="/tributes"
    >
      <article className="paper-card tribute-form-card tribute-form-card--wide">
        <div className="tribute-form-card__intro">
          <p className="content-tag">Open for submissions</p>
          <h3 className="content-title">
            Send a tribute, goodwill message, or photo
          </h3>
          <p className="content-body">
            A message is welcome on its own, a photo is welcome on its own, and
            both together work beautifully.
          </p>
          <p className="tribute-form-card__count">
            {approvedCount} {approvedCount === 1 ? "tribute" : "tributes"} on
            the wall so far
          </p>
        </div>

        <form className="tribute-form" onSubmit={handleSubmit}>
          <label>
            <span>Your name</span>
            <input name="name" type="text" required onChange={handleChange} />
          </label>
          <label>
            <span>Relationship to celebrant</span>
            <input
              name="relationship"
              type="text"
              placeholder="Friend, daughter, colleague..."
              onChange={handleChange}
            />
          </label>
          <label>
            <span>Tribute type</span>
            <select
              name="category"
              defaultValue="Goodwill"
              onChange={handleChange}
            >
              <option>Goodwill</option>
              <option>Memory</option>
              <option>Prayer</option>
              <option>Wish</option>
            </select>
          </label>
          <label>
            <span>Add a photo (optional)</span>
            <input
              name="photo"
              type="file"
              accept="image/*"
              onChange={handleChange}
            />
          </label>
          <label className="tribute-form__full">
            <span>Your message</span>
            <textarea
              name="message"
              rows="6"
              placeholder="Write a tribute, prayer, or birthday wish here..."
              onChange={handleChange}
            />
          </label>
          <div className="tribute-form__actions tribute-form__full">
            <button
              className="primary-button"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Sending..." : "Submit"}
            </button>
            {feedback && <p className="tribute-form__feedback">{feedback}</p>}
          </div>
        </form>
      </article>

      {approvedTributes.map((tribute) => (
        <article
          key={tribute.id || tribute.name}
          className="scrap-card tribute-card"
        >
          <div className="tribute-card__header">
            <div>
              <h3 className="content-title tribute-card__name">
                {tribute.name}
              </h3>
              <p className="content-meta">{tribute.relationship || "Guest"}</p>
            </div>
            <span className="category-pill">
              {tribute.category || "Goodwill"}
            </span>
          </div>
          <p className="content-body">{tribute.message}</p>
          {tribute.imageUrl && (
            <div className="tribute-card__media">
              <img
                className="tribute-card__image"
                src={tribute.imageUrl}
                alt={`${tribute.name} contribution`}
                loading="lazy"
                decoding="async"
              />
            </div>
          )}
        </article>
      ))}
    </CollectionPage>
  );
}
