import WalletConnectProvider from "@walletconnect/web3-provider"
import Authereum from 'authereum'
import Web3Modal from 'web3modal'
import { useRef, useState } from "react"
import { ethers, Signer } from "ethers"
import toast from "react-hot-toast"
import useTransactions from "./useTransactions"
import useIntent from "./useIntent"
import { Config } from "config.type"
import { Transaction } from "transaction.type"

const useEthereum = () => {
	const INFURA_ID = '460f40a260564ac4a4f4b3fffb032dad'

	const signer = useRef<Signer>()
	const address = useRef('')
	const [transactions, getTransactions, createTransaction, totalEarned] = useTransactions()
	const [updateIntent] = useIntent()

	const connectETH = async () => {
		const providerOptions = {
			walletconnect: {
				package: WalletConnectProvider, // required
				options: {
				infuraId: INFURA_ID, // required
				},
			},
			authereum: {
				package: Authereum, // required
			},
		}
	
		const web3modal = new Web3Modal({
			providerOptions,
		})
	
		try {
			const provider = await web3modal.connect()
			const ethProvider = new ethers.providers.Web3Provider(provider)
			const _signer = await ethProvider.getSigner()
			const _address = await _signer.getAddress()
			signer.current = _signer
			address.current = _address
			return true
		} catch (e) {
			throw e
		}
	}

	const payETH = async (transaction: Transaction, price: number, email: string, currency: Config) => {
		var toastTransact, toastConnect

		toastConnect = toast.loading('Connecting Ethereum Wallet')
		try {
			await connectETH()
		} catch (e) {
			toast.dismiss(toastConnect)
			toast.error("Can't connect to Wallet")
			return
		}
		toast.dismiss(toastConnect)
		toast.success('Successfully Connected to ' + address.current)

		toastTransact = toast.loading('Creating Ethereum Transaction')

		if(!signer.current) {
			toast.error('Connect your ethereum wallet')
			return
		}

		try {
			const tx = await signer.current.sendTransaction({
				to: transaction.to as string,
				value: ethers.utils.parseEther(price.toFixed(5)),
				chainId: currency.chainId as number
			})

			var txId = await createTransaction(email, transaction.fields, address.current, '', currency.name, tx.hash, 0, [], transaction.price)
			updateIntent({
				id: transaction.id,
				is_paid: true,
				transaction_hash: tx.hash,
				from_data: {
					email: email
				}
			})
			toast.dismiss(toastTransact)
			toast.success('Successfully sent Transaction')
			return tx
		} catch (e) {
			toast.dismiss(toastTransact)
			toast.error('Transaction not successful')
			console.log("WagPay: Can't send transaction!", e)
		}
	}

	const payERC20 = async (transaction: Transaction, price: number, email: string, currency: Config) => {
		if(!currency.tokenAddress) {
			toast.error('Not selected a currency')
			return
		}
		
		var toastTransact, toastConnect
		try {
			toastConnect = toast.loading('Connecting Ethereum Wallet')
			try {
				await connectETH()
			} catch (e) {
				toast.dismiss(toastConnect)
				toast.error("Can't connect to Wallet")
				return
			}
			toast.dismiss(toastConnect)
			toast.success('Successfully Connected to ' + address.current)

			toastTransact = toast.loading('Creating Ethereum Transaction')

			let erc20abi = [
				'function transfer(address to, uint amount) returns (bool)',
			]
			let erc20contract = new ethers.Contract(
				currency.tokenAddress,
				erc20abi,
				signer.current
			)
			let tx = await erc20contract.transfer(
				transaction.to as string,
				ethers.utils.parseUnits(price.toString(), 6)
			)

			toast.dismiss(toastTransact)
			toast.success('Created Transaction')

			toastTransact = toast.loading('Waiting for Ethereum Transaction')
			await tx.wait()
			toast.dismiss(toastTransact)
			toast.success('Transaction Succesful')
			var txId = await createTransaction(email, transaction.fields, address.current, '', currency.name, tx.hash, 0, [], transaction.price)
			updateIntent({
				id: transaction.id,
				is_paid: true,
				transaction_hash: tx.hash,
				from_data: {
					email: email
				}
			})
			console.log(tx)
		} catch (e) {
			toast.dismiss(toastTransact)
			toast.error("Can't Transact")
		}
	}

	return [signer, address, connectETH, payETH, payERC20] as any
}

export default useEthereum