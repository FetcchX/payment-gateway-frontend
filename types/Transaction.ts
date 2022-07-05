export interface Transaction { 
	id: number
	created_at: string
	name: string
	fields: any[]
	contact_number: string
	email: string
	eth_address?: string
	sol_address?: string
	currency: string
	pagesId?: any
	transaction_hash?: string
	page?: any
	products: any[]
	total_prices: number
}

export interface Transactions {
	cursor: number
	data: Transaction[]
}