const Steps = () => {
	return (
		<div className="w-full h-20 flex flex-col justify-center items-center space-y-3">
			<div className="flex space-x-20 sm:space-x-28 md:space-x-40 lg:space-x-56 xl:space-x-96">
				<h1>Step 1</h1>
				<h1>Step 2</h1>
				<h1>Step 3</h1>
			</div>
			<div className="w-full h-11/12 flex justify-center items-center">
				<div>
					<div className="w-10 h-10 rounded-full bg-white flex justify-center items-center">
						<div className="w-3 h-3 rounded-full bg-[#6C7EE2]"></div>
					</div>
				</div>
				<div className="w-20 sm:w-28 md:w-40 lg:w-56 xl:w-96 h-1 bg-[#6C7EE2]" />
				<div>
					<div className="w-10 h-10 rounded-full bg-white flex justify-center items-center">
						<div className="w-3 h-3 rounded-full bg-[#6C7EE2]"></div>
					</div>
				</div>
				<div className="w-20 sm:w-28 md:w-40 lg:w-56 xl:w-96 h-1 bg-[#6C7EE2]" />
				<div>
					<div className="w-10 h-10 rounded-full bg-white flex justify-center items-center">
						<div className="w-3 h-3 rounded-full bg-[#6C7EE2]"></div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Steps