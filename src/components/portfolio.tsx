import CodingProfile from "./codingProfile";
import RepoProfile from "./repoProfile";

function Portfolio() {
    return (
        <>
            <div className="flex flex-col gap-6">
                <div className="bg-[#e3f2fd] flex flex-col sm:flex-row gap-8">
                    <CodingProfile />
                    <RepoProfile />
                </div>
            </div>
        </>
    )
}

export default Portfolio