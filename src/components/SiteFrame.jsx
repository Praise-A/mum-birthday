import { Heart, Sparkles } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

import { navigationItems } from "@/data/siteContent.js";

import "./SiteFrame.css";

function getNavClassName({ isActive }) {
  return isActive ? "site-nav__link is-active" : "site-nav__link";
}

export default function SiteFrame() {
  return (
    <div className="site-frame">
      <div className="site-frame__wash" />
      <div className="site-frame__grid" />

      <div className="site-shell">
        <header className="paper-card site-header">
          <div className="site-brand">
            <div className="site-brand__mark">
              <Heart className="icon-sm" />
            </div>
            <div>
              <p className="site-brand__eyebrow">Mum at Fifty</p>
              <p className="site-brand__title">A keepsake in her honour</p>
            </div>
          </div>

          <nav aria-label="Primary navigation" className="site-nav">
            {navigationItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={getNavClassName}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="site-main">
          <Outlet />
        </main>

        <footer className="site-footer">
          <div className="site-footer__inner">
            <p>Built as a warm scrapbook tribute for a private family celebration.</p>
            <p className="footer-note">
              <Sparkles className="icon-xs footer-note__icon" />
              Stories, prayers, gallery moments, and voices all in one place.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
