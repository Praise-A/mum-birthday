import {
  ArrowRight,
  CalendarCheck2,
  Camera,
  HeartHandshake,
  Mic2,
  Music4,
  Quote,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import PhotoSlot from "@/components/PhotoSlot.jsx";
import SectionTitle from "@/components/SectionTitle.jsx";
import {
  celebrantPhotoSlots,
  eventDetails,
  fallbackTributes,
  heartPlea,
  heroStats,
  journeyIntroduction,
  milestones,
  musicSelections,
  quoteCards,
  stories,
  voiceNotes,
} from "@/data/siteContent.js";
import { fetchPublicSubmissions } from "@/lib/api.js";

import "./Home.css";

function getCountdownLabel() {
  const target = new Date(eventDetails.birthdayDate).getTime();
  const now = Date.now();
  const diff = Math.max(target - now, 0);
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days > 0 ? `${days} days to go` : "Birthday season is here";
}

function getCountdownParts() {
  const target = new Date(eventDetails.birthdayDate).getTime();
  const now = Date.now();
  const diff = Math.max(target - now, 0);
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;
  return [
    { label: "Days", value: String(days).padStart(2, "0") },
    { label: "Hours", value: String(hours).padStart(2, "0") },
    { label: "Minutes", value: String(minutes).padStart(2, "0") },
    { label: "Seconds", value: String(seconds).padStart(2, "0") },
  ];
}

const celebrationHighlights = [
  {
    title: "Share a tribute or birthday prayer",
    description:
      "Write something from the heart — a memory, a blessing, or a word of gratitude for the woman who has poured herself into so many lives.",
  },
  {
    title: "Drop a favourite photo",
    description:
      "Upload a portrait, a candid, or a cherished moment with the celebrant. Every image becomes part of this keepsake she will carry into the next fifty years.",
  },
  {
    title: "Browse memories from loved ones",
    description:
      "Read stories, listen to voice notes, and see how many lives she secretly impacted — one act of love at a time.",
  },
];

export default function Home() {
  const [approvedTributes, setApprovedTributes] = useState(fallbackTributes);
  // All photo slots for gallery preview (full row)
  const galleryPreviewPhotos = celebrantPhotoSlots;
  const featuredStory = stories[0];
  const soundtrackPreview = musicSelections.slice(0, 2);
  const soundtrackDescription =
    "Worship and praise have always been part of her story. These songs were chosen to reflect the gratitude and joy that fill this celebration.";

  useEffect(() => {
    let alive = true;
    fetchPublicSubmissions()
      .then((payload) => {
        if (!alive || !payload.submissions?.length) return;
        setApprovedTributes(payload.submissions.slice(0, 3));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const countdownLabel = useMemo(() => getCountdownLabel(), []);
  const countdownParts = useMemo(() => getCountdownParts(), []);

  const featureLinks = [
    {
      icon: HeartHandshake,
      title: "Her Story",
      description: "Discover the beautiful journey of her life.",
      to: "/blog",
    },
    {
      icon: Quote,
      title: "Share Your Tribute",
      description: "Leave your messages, memories, and photos.",
      to: "/tributes",
    },
    {
      icon: Camera,
      title: "Read the Blog",
      description: "Heartfelt posts and celebrations.",
      to: "/blog",
    },
    {
      icon: Music4,
      title: "Enjoy the Music",
      description: "Worship, praise & thanksgiving.",
      to: "#soundtrack",
    },
  ];

  return (
    <div className="page home-page">
      {/* ── HERO ───────────────────────────────────── */}
      <section className="home-stage">
        <div className="home-stage__photos">
          {celebrantPhotoSlots.map((photo, index) => (
            <article
              key={photo.id}
              className={`hero-strip hero-strip--${index + 1}`}
            >
              <img src={photo.src} alt={photo.title} loading="eager" />
              <div className="hero-strip__caption">
                <p>{photo.title}</p>
              </div>
            </article>
          ))}
        </div>

        <article className="paper-card home-stage__celebration">
          <div className="hero-glow" />
          <div className="hero-content">
            <div className="hero-copy">
              <p className="hero-eyebrow">{eventDetails.tagline}</p>

              {/* Big celebratory title — matches the "Happy 50th Birthday" from the reference */}
              <div className="hero-banner-row">
                <p className="home-stage__event">{eventDetails.title}</p>
                <p className="hero-date-chip">{countdownLabel}</p>
              </div>

              <h1 className="hero-title" aria-label="Happy 50th Birthday">
                <span className="hero-title-top">Happy</span>
                <span className="hero-fifty">50</span>
                <span className="hero-title-suffix">Birthday</span>
              </h1>

              <p className="hero-sub-tagline">
                Celebrating an incredible woman, an amazing life &amp; a
                beautiful journey
              </p>

              {/* Prominent date pill */}
              <div className="hero-date-pill">
                <CalendarCheck2 className="icon-xs" />
                November 12th
              </div>

              <p className="hero-description">
                {eventDetails.intro} Share how you met, what this journey has
                meant to you, and the moments of grace, faith, and love you have
                seen.
              </p>
            </div>

            <div className="button-row">
              <Link to="/tributes" className="primary-button">
                Write a tribute
                <ArrowRight className="icon-xs" />
              </Link>
              <Link to="/gallery" className="secondary-button">
                View the gallery
              </Link>
            </div>

            <div className="home-stage__stats">
              {heroStats.map((stat) => (
                <article key={stat.label} className="hero-stat">
                  <p className="hero-stat__value">{stat.value}</p>
                  <p className="hero-stat__label">{stat.label}</p>
                </article>
              ))}
            </div>
          </div>
        </article>
      </section>

      {/* ── FEATURE BAND ───────────────────────────── */}
      <section className="home-feature-band">
        <div className="home-feature-band__intro">
          <p className="content-tag">{journeyIntroduction.eyebrow}</p>
          <h2 className="home-feature-band__title">
            Honoring a Life of Love, Strength and Inspiration
          </h2>
          <p className="content-body">
            Join us as we celebrate a remarkable woman who has touched so many
            lives with her kindness, wisdom, and unwavering faith.
          </p>
        </div>

        <div className="home-feature-band__grid">
          {featureLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.title} to={item.to} className="home-feature-card">
                <div className="home-feature-card__icon">
                  <Icon className="icon-sm" />
                </div>
                <h3 className="home-feature-card__title">{item.title}</h3>
                <p className="home-feature-card__text">{item.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── SHOWCASE ───────────────────────────────── */}
      <section className="home-showcase">
        <article className="paper-card home-showcase-card">
          <div className="home-showcase-card__head">
            <p className="content-tag">Share Your Heart ♡</p>
          </div>
          <p className="content-body">{celebrationHighlights[0].description}</p>
          <div className="home-action-list">
            {celebrationHighlights.map((item) => (
              <article key={item.title} className="home-action-list__item">
                <p className="home-action-list__title">{item.title}</p>
                <p className="content-body">{item.description}</p>
              </article>
            ))}
          </div>
          <Link to="/tributes" className="primary-button">
            Write a tribute
            <HeartHandshake className="icon-xs" />
          </Link>
        </article>

        <article className="paper-card home-showcase-card">
          <div className="home-showcase-card__head home-showcase-card__head--center">
            <p className="content-tag">From the Blog</p>
          </div>
          <div className="home-story-preview">
            <div className="home-story-preview__image">
              <img
                src={celebrantPhotoSlots[2].src}
                alt={celebrantPhotoSlots[2].title}
                loading="lazy"
              />
            </div>
            <div className="home-story-preview__body">
              <p className="content-meta">{featuredStory.tag}</p>
              <h3 className="content-title home-story-preview__title">
                {featuredStory.title}
              </h3>
              <p className="content-body">{featuredStory.excerpt}</p>
              <blockquote className="content-quote">
                {featuredStory.pullQuote}
              </blockquote>
            </div>
          </div>
          <Link to="/blog" className="ink-link">
            Read all stories
            <ArrowRight className="icon-xs" />
          </Link>
        </article>

        <article
          id="soundtrack"
          className="paper-card home-showcase-card home-showcase-card--music"
        >
          <div className="home-showcase-card__head">
            <p className="content-tag">Now Playing 🎵</p>
          </div>
          <h3 className="content-title home-showcase-card__title">
            Songs that carry the spirit of this season.
          </h3>
          <p className="content-body">{soundtrackDescription}</p>
          <div className="home-track-list">
            {soundtrackPreview.map((track) => (
              <article key={track.title} className="home-track-item">
                <div className="home-track-item__copy">
                  <p className="home-track-item__title">{track.title}</p>
                  <p className="content-meta">{track.artist}</p>
                </div>
                <a href={track.href} target="_blank" rel="noreferrer">
                  <ArrowRight className="icon-xs" />
                </a>
              </article>
            ))}
          </div>
        </article>
      </section>

      {/* ── COUNTDOWN ──────────────────────────────── */}
      <section className="home-countdown-strip">
        <blockquote className="home-countdown-strip__quote">
          <Quote className="icon-sm" />
          <div>
            <p className="quote-card__text">{quoteCards[1].text}</p>
            <p className="content-meta">{quoteCards[1].source}</p>
          </div>
        </blockquote>

        <div className="home-countdown-strip__panel">
          <div className="home-countdown-strip__header">
            <CalendarCheck2 className="icon-sm" />
            <p className="content-tag">Countdown to the Big Day!</p>
          </div>
          <p className="home-countdown-strip__date">{heroStats[0].value}</p>
          <div className="home-countdown-grid">
            {countdownParts.map((part) => (
              <article key={part.label} className="home-countdown-box">
                <p className="home-countdown-box__value">{part.value}</p>
                <p className="home-countdown-box__label">{part.label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEGACY / LETTER ────────────────────────── */}
      <section className="home-legacy-grid">
        <article className="paper-card section-shell home-letter-card">
          <SectionTitle
            eyebrow={journeyIntroduction.eyebrow}
            title={journeyIntroduction.title}
            description={journeyIntroduction.description}
          />
          <div className="home-letter-card__body">
            {journeyIntroduction.paragraphs.map((paragraph) => (
              <p key={paragraph} className="content-body">
                {paragraph}
              </p>
            ))}
          </div>
        </article>

        <aside className="scrap-card section-shell home-support-card">
          <div className="home-impact-copy__meta">
            <HeartHandshake className="icon-sm" />
            <p>{heartPlea.eyebrow}</p>
          </div>
          <h2 className="voices-column__title">{heartPlea.title}</h2>
          <p className="voices-column__text">{heartPlea.description}</p>
          <p className="content-body">{heartPlea.body}</p>
          <p className="content-body">{heartPlea.closing}</p>
          <div className="home-impact-focus-list">
            {heartPlea.focusAreas.map((item) => (
              <p key={item} className="home-impact-focus-item">
                {item}
              </p>
            ))}
          </div>
          <div className="home-impact-contact-list">
            <a
              className="home-impact-contact"
              href={`tel:${heartPlea.contactPhone}`}
            >
              Call {heartPlea.contactPhone}
            </a>
            {heartPlea.contactEmails.map((email) => (
              <a
                key={email}
                className="home-impact-contact"
                href={`mailto:${email}`}
              >
                {email}
              </a>
            ))}
          </div>
        </aside>
      </section>

      {/* ── GALLERY (full width) + TRIBUTES ────────── */}
      <section className="home-gallery-tributes">
        {/* Gallery — now 100% wide, 5-column photo grid */}
        <article className="section-shell home-gallery-card">
          <div className="section-header-row">
            <SectionTitle
              eyebrow="Portrait gallery"
              title="A glimpse of the woman behind the celebration"
              description="A few portraits chosen with care. Head to the full gallery to see every moment contributed by family and friends."
            />
            <Link to="/gallery" className="ink-link">
              See full gallery
              <Camera className="icon-xs" />
            </Link>
          </div>

          <div className="home-gallery-grid">
            {galleryPreviewPhotos.map((photo) => (
              <PhotoSlot key={photo.id} {...photo} />
            ))}
          </div>
        </article>

        {/* Tributes — full width beneath gallery */}
        <article className="section-shell home-tributes-card">
          <div className="section-header-row">
            <SectionTitle
              eyebrow="Tributes"
              title="What they are saying about her"
              description="A few of the messages already arriving. Every tribute is kept and will be presented to her on the day."
            />
            <Link to="/tributes" className="ink-link">
              Write a tribute
              <ArrowRight className="icon-xs" />
            </Link>
          </div>

          <div className="home-tribute-grid">
            {approvedTributes.map((tribute) => (
              <article
                key={tribute.id || tribute.name}
                className="scrap-card tribute-card"
              >
                <div className="tribute-card__header">
                  <div>
                    <p className="tribute-card__name">{tribute.name}</p>
                    <p className="content-meta">{tribute.relationship}</p>
                  </div>
                  <span className="category-pill">{tribute.category}</span>
                </div>
                <p className="content-body">{tribute.message}</p>
              </article>
            ))}
          </div>
        </article>
      </section>

      {/* ── TIMELINE + VOICES ──────────────────────── */}
      <section className="home-bottom-grid">
        <article className="section-shell home-timeline-section">
          <div className="section-header-row">
            <SectionTitle
              eyebrow="Her journey"
              title="Fifty years of moments worth remembering"
              description="From a beautiful beginning to this golden milestone — a life shaped by faith, family, and quiet, faithful love."
            />
          </div>
          <div className="timeline-grid home-timeline-grid">
            {milestones.map((milestone) => (
              <article
                key={milestone.year}
                className="scrap-card timeline-card"
              >
                <div className="timeline-card__meta">
                  <CalendarCheck2 className="icon-sm" />
                  <span>{milestone.year}</span>
                </div>
                <h3 className="content-title">{milestone.title}</h3>
                <p className="content-body">{milestone.description}</p>
              </article>
            ))}
          </div>
        </article>

        <article className="section-shell voices-column home-voices-column">
          <div className="voices-column__meta">
            <Mic2 className="icon-sm" />
            <p>Voices and blessings</p>
          </div>
          <h2 className="voices-column__title">
            Some love is best heard, not just read.
          </h2>
          <p className="voices-column__text">
            Listen to the people closest to her — spoken memories, birthday
            prayers, and blessings recorded especially for this day.
          </p>
          <div className="voice-list">
            {voiceNotes.map((voice) => (
              <article key={voice.title} className="paper-card voice-card">
                <p className="content-tag">{voice.person}</p>
                <h3 className="content-title voice-card__title">
                  {voice.title}
                </h3>
                <p className="content-body">{voice.note}</p>
              </article>
            ))}
          </div>
          <blockquote className="scrap-card quote-card home-voices-column__quote">
            <p className="quote-card__text">{quoteCards[1].text}</p>
            <footer className="content-meta">{quoteCards[1].source}</footer>
          </blockquote>
          <div className="button-row home-voices-column__actions">
            <Link to="/tributes" className="primary-button">
              Send your message
              <HeartHandshake className="icon-xs" />
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}
