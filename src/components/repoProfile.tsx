import githubSvg from './../assets/github.svg';

function RepoProfile() {
    return (
        <>
            <div className="rounded-3xl border border-[#508de8] overflow-hidden box-shadow-blue-4081e3 min-w-[175px]">
                <h3 className="font-poppins-1 font-medium p-4 bg-[#75a8f5] text-[#ffffff]">Repositories</h3>

                {/* Card for GitHub */}
                <div className="flex gap-4 bg-[#d8e7ff] p-4">
                    <div className="h-46 w-36 p-4 flex flex-col gap-2 border rounded-3xl bg-[#ffffff] min-w-[144px]">
                        <div className="h-1/3">
                            <img className="w-full h-full" src={githubSvg}></img>
                        </div>
                        <div className="flex flex-grow flex-col justify-between">
                            <h6 className="bg-[#000000] text-[#FFFFFF] text-center">GitHub</h6>
                            <p className="p-2 leading-none text-sm">Projects and contributions</p>
                            <button onClick={() => { window.open("https://github.com/wings-aka-shiva", '_blank') }} className="bg-[#ffffff] cursor-pointer rounded-xl text-sm border-[#000000] border-2">To profile</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RepoProfile