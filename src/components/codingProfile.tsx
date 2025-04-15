import leetcodeSvg from './../assets/leetcode.svg';
import hackerrankSvg from './../assets/hackerrank.svg';

function CodingProfile() {
  return (
    <>
      <h3>Coding profiles</h3>

      <div className="flex gap-4">
        {/* Card for Leet code */}

        <div className="h-46 w-36 p-4 flex flex-col gap-4 border border-[#070706] rounded-3xl bg-[#f2f2f2]">
          <div className="h-1/3">
            <img className="w-full h-full" src={leetcodeSvg}></img>
          </div>
          <div className="flex flex-grow flex-col justify-between">
            <h6 className="bg-[#070706] text-[#FFFFFF] text-center box-shadow-leet-code-orange">Leet Code</h6>
            <p className="p-2 leading-none text-sm">My current DS playground</p>
            <button className="bg-[#e7a41f] rounded-xl text-[#FFFFFF] text-sm">To profile</button>
          </div>
        </div>

        {/* Card for HackerRank */}

        <div className="h-46 w-36 p-4 flex flex-col gap-2 border border-[#2fc363] rounded-3xl bg-[#ffffff]">
          <div className="h-1/3 flex justify-center align-center">
            <div>
              <img className="h-full p-[1px] rounded-xl bg-[#000000]" src={hackerrankSvg}></img>
            </div>
          </div>
          <div className="flex flex-grow flex-col justify-between">
            <h6 className="bg-[#000000] text-[#FFFFFF] text-center box-shadow-hacker-rank-green">HackerRank</h6>
            <p className="p-2 leading-none text-sm">It all started here</p>
            <button className="bg-[#2fc363] rounded-xl text-sm text-[#ffffff]">To profile</button>
          </div>
        </div>
      </div>

    </>
  )
}

export default CodingProfile