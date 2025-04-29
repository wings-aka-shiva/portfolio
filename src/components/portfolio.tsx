import CodingProfile from "./codingProfile";
import RepoProfile from "./repoProfile";
import TeachingProfile from "./teaching-profile";

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
        </>
    )
}

export default Portfolio