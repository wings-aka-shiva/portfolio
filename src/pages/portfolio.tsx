import { useEffect } from "react";
import Hero from "../components/sections/Hero";
import HomeExperience from "../components/sections/HomeExperience";
import DeepDives from "../components/sections/DeepDives";
import HomeProjects from "../components/sections/HomeProjects";
import WritingAndPractice from "../components/sections/WritingAndPractice";
import Stack from "../components/sections/Stack";
import HomeEducation from "../components/sections/HomeEducation";
import AboutTeaser from "../components/sections/AboutTeaser";
import Contact from "../components/sections/Contact";

// Each section shows its single best fact and links to its own page.
function Portfolio() {
  // Remember how far down the homepage the visitor is. The listener can still
  // fire once after navigating away (the next page scrolls to top), so only
  // save while the URL is still the homepage.
  useEffect(() => {
    const home = import.meta.env.BASE_URL.replace(/\/$/, "");
    const save = () => {
      if (window.location.pathname.replace(/\/$/, "") !== home) return;
      sessionStorage.setItem("homeScroll", String(window.scrollY));
    };
    window.addEventListener("scroll", save, { passive: true });
    return () => window.removeEventListener("scroll", save);
  }, []);

  return (
    <div>
      <Hero />
      <HomeExperience />
      <DeepDives />
      <HomeProjects />
      <WritingAndPractice />
      <Stack />
      <HomeEducation />
      <AboutTeaser />
      <Contact />
    </div>
  );
}

export default Portfolio;
