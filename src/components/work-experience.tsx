import iffaPng from './../assets/iffaawards.png';
import kekaSvg from './../assets/keka.svg';

function WorkExperience() {
    return (
        <>
            <div className="rounded-3xl border border-[#508de8] overflow-hidden box-shadow-blue-4081e3 min-w-[175px]">
                <h3 className="rounded-t-3xl font-poppins-1 font-medium p-4 bg-[#75a8f5] text-[#ffffff] tracking-widest text-center sm:text-left">WORK Experience</h3>

                {/* <div className="flex flex-col sm:flex-row gap-4 bg-[#d8e7ff] rounded-b-3xl p-4 overflow-auto items-center"> */}
                <div>

                    {/* Work Experience at IFFA */}
                    <div className="flex p-6 gap-4">
                        <div className="box-shadow-black-000000 h-46 w-36 p-4 flex flex-col gap-2 border rounded-3xl bg-[#ebd885] min-w-[144px]">
                            <div className="h-1/3 rounded-xl overflow-hidden">
                                <img className="w-full h-full" src={iffaPng}></img>
                            </div>
                            <div className="flex flex-grow flex-col justify-between">
                                <p className="leading-none text-center text-sm">IT - Developer </p>
                                <button onClick={() => { window.open("https://www.iffa.com.au/", '_blank') }} className="transition text-[#ebd885] ease-in-out duration-300 box-shadow-black-000000 bg-[#4d3d22] border-none cursor-pointer rounded-xl text-sm border-[1.5px] py-[2px]">Visit Company</button>
                            </div>
                        </div>
                        <div className="">
                            <h1 className="font-semibold">International Film Festival of Australia<span className="text-xs"> - Melbourne - (Mar 2025 - Jun 2025) - Internship</span></h1>
                            <ul className="list-disc pl-6 text-sm">
                                <li>
                                    Streamlined development workflow by moving all static data to service files and created shared components, increasing
                                    development speed by over 50%.
                                </li>
                                <li>
                                    Implemented the entire project setup from scratch, ensuring a seamless development environment by configuring React,
                                    Bootstrap, and resolving all associated dependencies.
                                </li>
                                <li>
                                    Managed a team of developers to accelerate project development progress by 50% through effective leadership, task
                                    delegation, and fostering collaboration in building the web application.
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Work Experience at KEKA */}

                    <div className="flex p-6 pt-0 gap-4">
                        <div className="box-shadow-black-000000 h-46 w-36 p-4 flex flex-col gap-2 border rounded-3xl bg-[#ffffff] min-w-[144px]">
                            <div className="h-1/3">
                                <img className="w-full h-full" src={kekaSvg}></img>
                            </div>
                            <div className="flex flex-grow flex-col justify-between">
                                <p className="leading-none text-center text-sm">Associate Software Engineer</p>
                                <button onClick={() => { window.open("https://www.keka.com/", '_blank') }} className="transition ease-in-out duration-300 box-shadow-black-000000 bg-[#ffffff] cursor-pointer rounded-xl text-sm border-[1.5px] py-[2px]">Visit Company</button>
                            </div>
                        </div>
                        <div className="">
                            <h1 className="font-semibold">KEKA Technologies <span className="text-xs">
                                - Hyderabad - (May 2023 - Dec 2024) - Full Time</span></h1>
                            <ul className="list-disc pl-6 text-sm">
                                <li>
                                    Played a pivotal role in developing the KEKA Marketplace standalone application from scratch by architecting foundational
                                    features and implementing scalable modules.
                                </li>
                                <li>
                                    Contributed to transforming a modular application into a standalone architecture by refactoring file structures and optimizing
                                    import dependency conventions, achieving a 70% reduction in application build time.
                                </li>
                                <li>
                                    Optimized development processes and implemented rigorous code reviews, reducing post-deployment bugs by 30% through
                                    proactive testing, refactoring, and quality assurance measures.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default WorkExperience