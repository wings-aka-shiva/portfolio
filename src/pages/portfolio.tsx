import Hero from "../components/sections/Hero";
import WorkExperience from "../components/sections/WorkExperience";
import Education from "../components/sections/Education";
import Skills from "../components/sections/Skills";
import CodingProfiles from "../components/sections/CodingProfiles";
import GitHubRepos from "../components/sections/GitHubRepos";
import Blog from "../components/sections/Blog";
import BeyondTheCode from "../components/sections/BeyondTheCode";
import Contact from "../components/sections/Contact";

function Portfolio() {
  return (
    <div>
      <Hero />
      <WorkExperience />
      <Education />
      <Skills />
      <CodingProfiles />
      <GitHubRepos />
      <Blog />
      <BeyondTheCode />
      <Contact />
    </div>
  );
}

export default Portfolio;
