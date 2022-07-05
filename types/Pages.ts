import { Product } from "../pages/api/product"

export interface Page {
	id: number
	title: string
	logo: string
	description: string
	social_links: Object
	accepted_currencies: string[]
	terms_conditions: string[]
	slug: string
	eth_address?: string
	sol_address?: string
	user: number
	products: Product[]
	created_data: string
}

export interface Pages {
	cursor: number
	data: Page[]
}