import leetcodeSvg from './../assets/leetcode.svg';

function CodingProfile() {
  return (
    <>
      <h3>Coding profiles</h3>
      <div className="h-46 w-36 border border-[#64B5F6] rounded-3xl bg-[#F1F8FF]">
        <div className="h-1/3">
          <img className="w-full h-full" src={leetcodeSvg}></img>
        </div>
        <div>
          <h6 className="bg-[#1E88E5] text-[#37474F]">Leet Code</h6>
          <button className="bg-[#039BE5]">To profile</button>
        </div>
      </div>
    </>
  )
}

export default CodingProfile