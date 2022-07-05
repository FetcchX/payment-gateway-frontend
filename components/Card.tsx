const Card = () => {
	return (
		<div className="font-inter shadow-xl relative w-[300px] xl:w-[449px] h-[545px] rounded-xl mt-10 flex flex-col justify-center items-center overflow-hidden">
			<div className="blur-3xl w-72 h-72 -top-20 -left-36 absolute bg-[#FFA8D5]/50 rounded-full"></div>
			<div className="blur-3xl w-72 h-72 -bottom-20 -right-36 absolute bg-[#6C7EE1]/50 rounded-full"></div>
			<div className="w-full h-1/2"></div>
			<div className="flex flex-col justify-center items-center w-full h-1/2 px-8 space-y-2">
				<h1 className="font-bold text-lg">Step 1 Gauranteed Safety</h1>
				<p className="text-center text-md">Millions of businesses of all sizes—from startups to large enterprises—use Wagpay’s software and APIs to accept payments, send payouts, and manage their businesses online.</p>
			</div>
		</div>
	)
}

export default Card