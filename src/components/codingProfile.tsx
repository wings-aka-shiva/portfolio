import leetcodeSvg from './../assets/leetcode.svg';
import hackerrankSvg from './../assets/hackerrank.svg';
import codechefSvg from './../assets/codechef.svg';

function CodingProfile() {
  return (
    <>
      <div className="rounded-3xl border border-[#508de8] box-shadow-blue-4081e3 min-w-[175px]">
        <h3 className="rounded-t-3xl font-poppins-1 font-medium p-4 bg-[#75a8f5] text-[#ffffff] tracking-widest text-center sm:text-left">"COD/NG pro" + "FILES"</h3>

        <div className="flex flex-col sm:flex-row gap-4 bg-[#d8e7ff] rounded-b-3xl p-4 overflow-auto items-center">

          {/* Card for HackerRank */}

          <div className="box-shadow-hacker-rank-green-hover transition ease-in-out duration-300 h-46 w-36 p-4 flex flex-col gap-2 border border-[#2fc363] rounded-3xl bg-[#ffffff] min-w-[144px]">
            <div className="h-1/3 flex justify-center align-center">
              <div>
                <img className="h-full p-[1px] rounded-xl bg-[#000000]" src={hackerrankSvg}></img>
              </div>
            </div>
            <div className="flex flex-grow flex-col justify-between">
              <h6 className="bg-[#000000] text-[#FFFFFF] text-center box-shadow-hacker-rank-green">HackerRank</h6>
              <p className="p-2 leading-none text-sm">It all started here</p>
              <button onClick={() => { window.open('https://www.hackerrank.com/profile/wingsAkaShiva', '_blank') }} className="box-shadow-black-000000 transition ease-in-out duration-300 bg-[#2fc363] cursor-pointer rounded-xl text-sm text-[#ffffff] pb-[3px]">To profile</button>
            </div>
          </div>

          {/* Card for Leet code */}

          <div className="box-shadow-leet-code-orange-hover transition ease-in-out duration-300 h-46 w-36 p-4 flex flex-col gap-2 border border-[#e7a41f] rounded-3xl bg-[#ffffff] min-w-[144px]">
            <div className="h-1/3">
              <img className="w-full h-full" src={leetcodeSvg}></img>
            </div>
            <div className="flex flex-grow flex-col justify-between">
              <h6 className="bg-[#070706] text-[#FFFFFF] text-center box-shadow-leet-code-orange">Leet Code</h6>
              <p className="p-2 leading-none text-sm">I often practise here</p>
              <button onClick={() => { window.open('https://leetcode.com/u/shiva_flyin/', '_blank') }} className="box-shadow-black-000000 transition ease-in-out duration-300 bg-[#e7a41f] cursor-pointer rounded-xl text-[#FFFFFF] text-sm pb-[3px]">To profile</button>
            </div>
          </div>

          {/* Card for Code Chef */}

          <div className="box-shadow-code-chef-red-ef5350-hover transition ease-in-out duration-300 h-46 w-36 p-4 flex flex-col gap-2 border border-[#ef5350] rounded-3xl bg-[#ffffff] min-w-[144px]">
            <div className="h-1/3">
              <img className="w-full h-full" src={codechefSvg}></img>
            </div>
            <div className="flex flex-grow flex-col justify-between">
              <h6 className="bg-[#070706] text-[#FFFFFF] text-center box-shadow-code-chef-red-ef5350">Code Chef</h6>
              <p className="p-2 leading-none text-sm">I contest here</p>
              <button onClick={() => { }} className="transition ease-in-out duration-300 bg-[#ef5350] box-shadow-black-000000 cursor-pointer rounded-xl text-[#FFFFFF] text-sm pb-[3px]">Coming Soon</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CodingProfile