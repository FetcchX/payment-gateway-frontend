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

const Feature = (props: Props) => {
	return (
		<>
		{props.invert && 
			<div className="w-2/3 h-full xl:h-80 font-inter flex flex-col md:flex-row justify-between">
				<div className="w-full lg:w-1/2 h-full xl:h-80 flex flex-col justify-center items-start space-y-4">
					<div className="md:hidden w-full lg:w-1/2 h-40 sm:h-80 lg:h-full bg-[#6C7EE1]"></div>
					<h1 className="font-bold text-3xl lg:w-11/12 text-center">{props.title}</h1>
					<p className="text-sm text-center">{props.desc}</p>
				</div>
				<div className="hidden md:block w-full lg:w-1/2 h-40 sm:h-80 md:h-80 xl:h-full bg-[#6C7EE1]"></div>
			</div>
		}
		{!props.invert && 
			<div className="w-2/3 h-full xl:h-80 font-inter flex flex-col md:flex-row justify-between md:space-x-5">
				<div className="hidden md:block w-full lg:w-1/2 h-40 sm:h-80 md:h-80 xl:h-full bg-[#6C7EE1]"></div>
				<div className="w-full lg:w-1/2 h-full xl:h-80 flex flex-col justify-center items-start space-y-4">
					<div className="md:hidden w-full lg:w-1/2 h-40 sm:h-80 lg:h-full bg-[#6C7EE1]"></div>
					<h1 className="font-bold text-3xl lg:w-11/12 text-center">{props.title}</h1>
					<p className="text-sm text-center">{props.desc}</p>
				</div>
			</div>
		}
		</>
	)
}

export default Feature