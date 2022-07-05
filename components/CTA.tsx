import { useState } from "react"

const CTA = () => {
    const [username, setUsername] = useState('')

	const changeUsername = (e: any) => {
		if(username.startsWith('@')) {
			setUsername(e.target.value)
		} else {
			setUsername('@' + e.target.value)
		}
	}

	return (
        <div className="bg-[#6C7EE1]/20 w-full h-fit py-40 flex items-center justify-center font-inter">
            <div className="relative flex flex-col lg:flex-row justify-around items-center w-11/12 h-fit py-20 rounded-xl overflow-hidden shadow-xl">
				<div className="blur-3xl w-72 h-72 -top-20 -left-36 absolute bg-[#FFA8D5]/50 rounded-full"></div>
				<div className="blur-3xl w-72 h-72 -bottom-20 -right-36 absolute bg-[#6C7EE1]/50 rounded-full"></div>
				<div className="w-full h-full flex flex-col items-center justify-center space-y-2">
					<div className="text-3xl lg:text-5xl font-bold">
						Claim your Username
					</div>
					<p className="text-sm w-2/3 text-center">We’ll send you fresh news about our platform, including new features and opportunities for the community.</p>
				</div>
                <div className="h-full w-full flex justify-center items-center mt-10 lg:mt-0">
                    <div className="bg-white flex justify-between w-2/3 p-2 rounded-xl">
						<input type="text" placeholder="@satyam" className="rounded w-2/3 pl-4 py-4 opacity-80 border-0 outline-none text-sm" value={username} onChange={(e) => changeUsername(e)} />
						<button className="w-1/3 bg-gradient-to-tr from-[#4B74FF] to-[#9281FF] text-white rounded-xl py-3 text-sm">Claim</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CTA
