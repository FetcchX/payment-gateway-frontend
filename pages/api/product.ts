export interface Product {
	id: number
	discounted_price: number
	price: number
	name: string
	description: string
	links: string[]
	sold: number
	user: number
	image: File
}