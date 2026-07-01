import { BrowserRouter, Route, Routes } from "react-router-dom";

import SiteFrame from "@/components/SiteFrame.jsx";
import AdminPage from "@/pages/AdminPage.jsx";
import GalleryPage from "@/pages/GalleryPage.jsx";
import Home from "@/pages/Home.jsx";
import StoriesPage from "@/pages/StoriesPage.jsx";
import TributesPage from "@/pages/TributesPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteFrame />}>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<StoriesPage />} />
          <Route path="/tributes" element={<TributesPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
