import Card from "../Card"

const Cards = () => {
	return (
		<div className="w-full h-content flex justify-center items-center">
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:space-x-5">
				<Card></Card>
				<Card></Card>
				<Card></Card>
			</div>
		</div>
	)
}

export default Cards