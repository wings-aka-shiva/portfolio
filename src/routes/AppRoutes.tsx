import { Routes, Route, Navigate } from "react-router-dom";

import Portfolio from "../components/portfolio";
import MyWorld from "../pages/my-world";
import Layout from "../pages/layout";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/portfolio" replace />} />
        <Route path="/portfolio" element={<Portfolio />}></Route>
        <Route path="/my-world" element={<MyWorld />}></Route>
        <Route path="*" element={<Navigate to="/portfolio" replace />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes;