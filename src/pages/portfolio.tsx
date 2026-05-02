import Hero from "../components/sections/Hero";
import WorkExperience from "../components/sections/WorkExperience";
import Education from "../components/sections/Education";
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
      <CodingProfiles />
      <GitHubRepos />
      <Blog />
      <BeyondTheCode />
      <Contact />
    </div>
  );
}

export default Portfolio;
