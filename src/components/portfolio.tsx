import CodingProfile from "./codingProfile";
import RepoProfile from "./repoProfile";

function Portfolio() {
    return (
        <>
            <div className="bg-[#e3f2fd] flex gap-6">
                <CodingProfile />
                <RepoProfile />
            </div>
        </>
    )
}

export default Portfolio