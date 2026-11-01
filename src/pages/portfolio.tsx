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
