import superProf from './../assets/superprof.svg';

function TeachingProfile() {
    return (
        <>
            <div className="rounded-3xl border border-[#508de8] overflow-hidden box-shadow-blue-4081e3 min-w-[175px]">
                <h3 className="rounded-t-3xl font-poppins-1 font-medium p-4 bg-[#75a8f5] text-[#ffffff] tracking-widest text-center sm:text-left">MENTORING</h3>

                <div className="flex flex-col sm:flex-row gap-4 bg-[#d8e7ff] rounded-b-3xl p-4 overflow-auto items-center">

                    {/* Card for SuperProf */}

                    <div className="box-shadow-superprof-orange-hover h-46 w-36 p-4 flex flex-col gap-2 border rounded-3xl bg-[#ffffff] min-w-[144px] border-[#ff6363]">
                        <div className="h-1/3">
                            <img className="w-full h-full" src={superProf}></img>
                        </div>
                        <div className="flex flex-grow flex-col justify-between">
                            <h6 className="bg-[#000000] box-shadow-superprof-orange text-[#FFFFFF] text-center">SuperProf</h6>
                            <p className="p-2 leading-none text-xs">Wanna learn Data Structures?</p>
                            <button onClick={() => { window.open("https://www.superprof.com.au/software-engineer-specialized-problem-solving-apart-from-web-application-development-here-help-improve-your.html", '_blank') }} className="transition ease-in-out duration-300 box-shadow-black-000000 text-[#ffffff] bg-[#ff6363] cursor-pointer rounded-xl text-sm py-[2px]">Reach out</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TeachingProfile