import { Routes, Route, Navigate } from "react-router-dom";

import Layout      from "../pages/layout";
import Portfolio   from "../pages/portfolio";
import MyWorld     from "../pages/my-world";
import BlogLanding from "../pages/BlogLanding";
import ComingSoon  from "../pages/ComingSoon";
import NeetCodeMap from "../pages/NeetCodeMap";
import Novels      from "../pages/Novels";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Portfolio />} />
        <Route path="/my-world"  element={<MyWorld />} />

        {/* Blog routes */}
        <Route path="/blog"          element={<BlogLanding />} />
        <Route path="/blog/neetcode" element={<NeetCodeMap />} />
        <Route path="/blog/travel"   element={<ComingSoon emoji="✈️" category="Travelling" />} />
        <Route path="/blog/food"     element={<ComingSoon emoji="🍜" category="Food" />} />
        <Route path="/blog/liminal"  element={<ComingSoon emoji="🌌" category="Liminal" />} />
        <Route path="/blog/novels"   element={<Novels />} />
        <Route path="/blog/ai"       element={<ComingSoon emoji="🤖" category="AI Journey" />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
