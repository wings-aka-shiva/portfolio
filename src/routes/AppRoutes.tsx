import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/home";
import About from "../pages/about";
import Projects from "../pages/projects";
import Blogs from "../pages/blogs";
import Contacts from "../pages/contacts";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/home" element={<Home />}></Route>
      <Route path="/about" element={<About />}></Route>
      <Route path="/projects" element={<Projects />}></Route>
      <Route path="/blogs" element={<Blogs />}></Route>
      <Route path="/contacts" element={<Contacts />}></Route>
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}

export default AppRoutes;