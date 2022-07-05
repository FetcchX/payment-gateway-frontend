export interface User {
	id: number
	username: string
	eth_address?: string
	sol_address?: string
	is_paid: boolean
	created_at: Date
	email: string
}