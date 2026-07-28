import { Routes, Route, Navigate } from "react-router-dom";

import Layout      from "../pages/layout";
import Portfolio   from "../pages/portfolio";
import MyWorld     from "../pages/my-world";
import BlogLanding from "../pages/BlogLanding";
import ComingSoon  from "../pages/ComingSoon";
import NeetCodeMap from "../pages/NeetCodeMap";
import Novels      from "../pages/Novels";
import AIBlog      from "../pages/AIBlog";
import Liminal     from "../pages/Liminal";
import Guitar      from "../pages/Guitar";
import Between     from "../pages/Between";
import Now         from "../pages/Now";

function AppRoutes() {
  return (
    <Routes>
      {/* Standalone full-screen experience — no Layout wrapper */}
      <Route path="/blog/between" element={<Between />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<Portfolio />} />
        <Route path="/my-world"  element={<MyWorld />} />
        <Route path="/now"       element={<Now />} />

        {/* Blog routes */}
        <Route path="/blog"          element={<BlogLanding />} />
        <Route path="/blog/neetcode" element={<NeetCodeMap />} />
        <Route path="/blog/neetcode/:slug" element={<NeetCodeMap />} />
        <Route path="/blog/travel"   element={<ComingSoon emoji="✈️" category="Travelling" />} />
        <Route path="/blog/food"     element={<ComingSoon emoji="🍜" category="Food" />} />
        <Route path="/blog/liminal"         element={<Liminal />} />
        <Route path="/blog/liminal/:slug"   element={<Liminal />} />
        <Route path="/blog/novels"   element={<Novels />} />
        <Route path="/blog/ai"         element={<AIBlog />} />
        <Route path="/blog/ai/:slug"   element={<AIBlog />} />

        <Route path="/guitar" element={<Navigate to="/guitar/metronome" replace />} />
        <Route path="/guitar/metronome" element={<Guitar />} />
        <Route path="/guitar/beginner-progression" element={<Guitar />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
