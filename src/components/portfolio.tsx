import CodingProfile from "./codingProfile";
import RepoProfile from "./repoProfile";
import WorkExperience from "./work-experience";

function Portfolio() {
    return (
        <>
            <div className="flex flex-col gap-6">
                <div className="bg-[#e3f2fd] flex flex-col sm:flex-row gap-8">
                    <CodingProfile />
                    <RepoProfile />
                </div>
                {/* <WorkExperience /> */}
            </div>
        </>
    )
}

export default Portfolio