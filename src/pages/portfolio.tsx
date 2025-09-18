import CodingProfile from "../components/codingProfile";
import RepoProfile from "../components/repoProfile";
import TeachingProfile from "../components/teaching-profile";
import WorkExperience from "../components/work-experience";

function Portfolio() {
    return (
        <>
            <div className="flex flex-col gap-6">
                <div className="bg-[#e3f2fd] flex flex-col sm:flex-row gap-8">
                    <CodingProfile />
                    <RepoProfile />
                    <TeachingProfile />
                </div>
            </div>
            <div>
                <WorkExperience />
            </div>
        </>
    )
}

export default Portfolio