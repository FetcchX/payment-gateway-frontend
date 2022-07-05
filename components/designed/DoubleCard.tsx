interface Props {
	invert: boolean
	for: string
	title: string
	desc: string
	point1: string
	point1desc: string
	point2: string
	point2desc: string
}

const DoubleCard = (props: Props) => {
	return (
		<>
		{props.invert && 
			<div className="w-2/3 h-full xl:h-80 font-inter flex flex-col md:flex-row justify-between">
				<div className="w-full lg:w-1/2 h-full flex-col justify-center items-center lg:items-start space-y-4">
					<h3 className="text-[#6C7EE1] font-bold">{props.for}</h3>
					<div className="md:hidden w-full lg:w-1/2 h-40 sm:h-80 lg:h-full bg-[#6C7EE1]"></div>
					<h1 className="font-bold text-3xl lg:w-2/3 text-center md:text-left">{props.title}</h1>
					<p className="text-sm text-center md:text-left">{props.desc}</p>
					<div className="w-full flex flex-col lg:flex-row justify-center items-start space-y-3 lg:space-y-0 lg:space-x-3">
						<div className="w-full lg:w-1/2 space-y-3">
							<h2 className="text-[#6C7EE1] font-bold text-center md:text-left">{props.point1}</h2>
							<p className="text-sm w-full md:w-10/12 text-center md:text-left">{props.point1desc}</p>
						</div>
						<div className="w-full lg:w-1/2 space-y-3">
							<h2 className="text-[#6C7EE1] font-bold text-center md:text-left">{props.point2}</h2>
							<p className="text-sm w-full md:w-10/12 text-center md:text-left">{props.point2desc}</p>
						</div>
					</div>
				</div>
				<div className="hidden md:block w-full lg:w-1/2 h-40 sm:h-80 md:h-80 xl:h-full bg-[#6C7EE1]"></div>
			</div>
		}
		{!props.invert && 
			<div className="w-2/3 h-full xl:h-80 font-inter flex flex-col md:flex-row justify-between md:space-x-5">
				<div className="hidden md:block w-full lg:w-1/2 h-40 sm:h-80 md:h-80 xl:h-full bg-[#6C7EE1]"></div>
				<div className="w-full lg:w-1/2 h-full flex-col justify-center items-center lg:items-start space-y-4">
					<h3 className="text-[#6C7EE1] font-bold">{props.for}</h3>
					<div className="md:hidden w-full lg:w-1/2 h-40 sm:h-80 lg:h-full bg-[#6C7EE1]"></div>
					<h1 className="font-bold text-3xl lg:w-2/3 text-center md:text-left">{props.title}</h1>
					<p className="text-sm text-center md:text-left">{props.desc}</p>
					<div className="w-full flex flex-col lg:flex-row justify-center items-start space-y-3 lg:space-y-0 lg:space-x-3">
						<div className="w-full lg:w-1/2 space-y-3">
							<h2 className="text-[#6C7EE1] font-bold text-center md:text-left">{props.point1}</h2>
							<p className="text-sm w-full md:w-10/12 text-center md:text-left">{props.point1desc}</p>
						</div>
						<div className="w-full lg:w-1/2 space-y-3">
							<h2 className="text-[#6C7EE1] font-bold text-center md:text-left">{props.point2}</h2>
							<p className="text-sm w-full md:w-10/12 text-center md:text-left">{props.point2desc}</p>
						</div>
					</div>
				</div>
			</div>
		}
		</>
	)
}

export default DoubleCard