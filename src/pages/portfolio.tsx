import Hero from "../components/sections/Hero";
import WorkExperience from "../components/sections/WorkExperience";
import Hackathons from "../components/sections/Hackathons";
import Projects from "../components/sections/Projects";
import Skills from "../components/sections/Skills";
import Education from "../components/sections/Education";
import Elsewhere from "../components/sections/Elsewhere";
import Blog from "../components/sections/Blog";
import AboutMe from "../components/sections/AboutMe";
import Contact from "../components/sections/Contact";

function Portfolio() {
  return (
    <div>
      <Hero />
      <WorkExperience />
      <Hackathons />
      <Projects />
      <Skills />
      <Education />
      <Elsewhere />
      <Blog />
      <AboutMe />
      <Contact />
    </div>
  );
}

export default Portfolio;
