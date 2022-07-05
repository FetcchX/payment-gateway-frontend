import { useRef, useState } from "react"
import toast from "react-hot-toast"
import useTransactions from "./useTransactions"
import useIntent from "./useIntent"
import { Config } from "config.type"
import { Cluster, clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js"
import {
	getAccount,
	getAssociatedTokenAddress,
	transfer,
	TOKEN_PROGRAM_ID,
	createTransferInstruction,
} from '@solana/spl-token'
import { createQR, encodeURL, findTransactionSignature, FindTransactionSignatureError, validateTransactionSignature } from "@solana/pay"
import BigNumber from "bignumber.js"
import { Transaction as TInterface } from "../types/transaction.type"

const useSolana = () => {
	const address = useRef('')
	const [transactions, getTransactions, createTransaction, totalEarned] = useTransactions()
	const [updateIntent] = useIntent()

	const connectSOL = async () => {
		try {
			await window.solana.connect()
			address.current = window.solana.publicKey.toString()
		} catch (e) {
			throw e
		}
	}

	const paySOL = async (tx: TInterface, price: number, email: string, currency: Config) => {
		var toastIdTransact
		try {
			const toastIdConnect = toast.loading('Connecting Solana Wallet')
			try {
				await connectSOL()
			} catch (e) {
				toast.dismiss(toastIdConnect)
				toast.error('Solana Wallet Not Connected')
				return
			}
			const solProvider = window.solana
			const solConnection = new Connection(clusterApiUrl(currency.chainId as Cluster))
			toast.dismiss(toastIdConnect)
			toast.success('Successfully Connected Phantom')

			toastIdTransact = toast.loading('Creating Solana Transaction')
			var transaction = new Transaction().add(
				SystemProgram.transfer({
					fromPubkey: solProvider.publicKey,
					toPubkey: new PublicKey(tx.to),
					lamports: price * LAMPORTS_PER_SOL,
				})
			)

			transaction.feePayer = await solProvider.publicKey
			let blockhashObj = await solConnection.getRecentBlockhash()
			transaction.recentBlockhash = await blockhashObj.blockhash

			if (transaction) {
				console.log('Txn created successfully')
			}

			let signed = await solProvider.signTransaction(transaction)

			let signature = await solConnection.sendRawTransaction(
				signed.serialize()
			)
			await solConnection.confirmTransaction(signature)
			
			toast.dismiss(toastIdTransact)
			toast.success("Transaction Successful✅")

			var txId = await createTransaction(
				email,
				tx.fields,
				'',
				solProvider.publicKey.toString(),
				currency.name,
				signature,
				0, 
				[],
				tx.price
			)
			updateIntent({
				id: tx.id,
				is_paid: true,
				transaction_hash: signature,
				from_data: {
					email: email
				}
			})

			return signature
		} catch(e) {
			console.log(e)
		}
	}

	const paySPL = async (tx: TInterface, price: number, email: string, currency: Config) => {
		if(!currency.tokenAddress) {
			toast.error('Not selected a currency')
			return
		}

		let toastIdTransact
		const toastIdConnect = toast.loading('Connecting Solana Wallet')
		try {
			await connectSOL()
		} catch (e) {
			toast.dismiss(toastIdConnect)
			toast.error('Solana Wallet Not Connected')
			return
		}
		const solProvider = window.solana
		const solConnection = new Connection(clusterApiUrl(currency.chainId as Cluster))
		toast.dismiss(toastIdConnect)
		toast.success('Successfully Connected Phantom')

		toastIdTransact = toast.loading('Creating Solana Transaction')

		var tokenAccountInfo: any
		var merchantTokenAccount: any
		var merchantTokenAccountInfo: any

		try {
			var tokenAccount = await getAssociatedTokenAddress(
				new PublicKey(currency.tokenAddress),
				solProvider.publicKey
			)
			tokenAccountInfo = await getAccount(solConnection, tokenAccount)
			merchantTokenAccount = await getAssociatedTokenAddress(
			   new PublicKey(currency.tokenAddress),
			   new PublicKey(tx.to) 
		   )
		   merchantTokenAccountInfo = await getAccount(
			   solConnection,
			   merchantTokenAccount
		   )
		} catch(e) {
			console.log(e)
			toast.error("Can't find your token account!")
			toast.dismiss(toastIdTransact)
			return
		}



		console.log(tokenAccountInfo)

		const instructions: TransactionInstruction = createTransferInstruction(
			tokenAccountInfo.address,
			merchantTokenAccountInfo.address,
			solProvider.publicKey,
			1,
			[],
			TOKEN_PROGRAM_ID
		)

		const transaction = new Transaction().add(instructions)
		transaction.feePayer = solProvider.publicKey
		transaction.recentBlockhash = (
			await solConnection.getRecentBlockhash()
		).blockhash
		let signed = await solProvider.signTransaction(transaction)

		const transactionSignature = await solConnection.sendRawTransaction(
			signed.serialize()
		)

		await solConnection.confirmTransaction(transactionSignature)

		toast.dismiss(toastIdTransact)
		toast.success("Transaction Successful✅")
		
		const txId = await createTransaction(email, tx.fields, '', solProvider.publicKey, currency.name, transactionSignature, 0, [], tx.price)
		updateIntent({
			id: tx.id,
			is_paid: true,
			transaction_hash: transactionSignature,
			from_email: email
		})
	}

	const qrCodeSOL = async (tx: TInterface, store_data: any, price: number, email: string, currency: Config, setURL: Function, setQrCode: Function, setIsModalOpen: Function) => {
		const connection = new Connection(clusterApiUrl(currency.chainId as Cluster))
		const recipient = new PublicKey(tx.to)
		
		const amount = new BigNumber(price.toFixed(2))
		const reference = new Keypair().publicKey
		const label = store_data.title
		const message = `${store_data.title} - Payment Intent ${tx.id}`
		const memo = tx.id

		const url = encodeURL({
			recipient,
			amount,
			reference,
			label,
			message,
			memo,
		})

		const qrCode = createQR(url);
		setURL(url)
		setQrCode(qrCode._qr?.createDataURL())
		setIsModalOpen(true)

		console.log('\n5. Find the transaction')
		let signatureInfo

		const { signature } = await new Promise((resolve, reject) => {
			var a = false
			const interval = setInterval(async () => {
			console.count('Checking for transaction...')
			try {
				signatureInfo = await findTransactionSignature(
				connection,
				reference,
				undefined,
				'confirmed'
				)
				console.log('\n 🖌  Signature found: ', signatureInfo.signature, a)
				if(!a) {
				a = true;
				var txId = await createTransaction(email, tx.fields, '', '', currency.name, signatureInfo.signature.toString(), 0, [], tx.price)
				updateIntent({
					id: tx.id,
					is_paid: true,
					transaction_hash: signatureInfo.signature.toString(),
					from_data: {
						email: email
					}
				})
				toast.success('Payment Successful')
				setIsModalOpen(false)
				}
				clearInterval(interval)
				resolve(signatureInfo)
			} catch (error: any) {
				if (!(error instanceof FindTransactionSignatureError)) {
				console.error(error)
				clearInterval(interval)
				reject(error)
				}
			}
			}, 250)
		})

		// Update payment status
		var paymentStatus = 'confirmed'

		/**
		 * Validate transaction
		 *
		 * Once the `findTransactionSignature` function returns a signature,
		 * it confirms that a transaction with reference to this order has been recorded on-chain.
		 *
		 * `validateTransactionSignature` allows you to validate that the transaction signature
		 * found matches the transaction that you expected.
		 */
		console.log('\n6. 🔗 Validate transaction \n')

		try {
			await validateTransactionSignature(
				connection,
				signature,
				recipient,
				amount,
				undefined,
				reference
			)

			// Update payment status
			paymentStatus = 'validated'
			// @ts-ignore
			// await updateTransaction(txId, true, signatureInfo?.signature)
		} catch (error) {
			console.error('❌ Payment failed', error)
		}
	}

	const qrCodeSPL = async (tx: TInterface, store_data: any, price: number, email: string, currency: Config, setURL: Function, setQrCode: Function, setIsModalOpen: Function) => {
		if(!currency.tokenAddress) {
			toast.error('Select a Valid SPL Token')
			return
		}
		
		const connection = new Connection(clusterApiUrl('devnet'))
		const splToken = new PublicKey(
			currency.tokenAddress
		)
		console.log('3. 💰 Create a payment request link \n')
		const recipient = new PublicKey(tx.to)
		const amount = new BigNumber(tx.value)
		const reference = new Keypair().publicKey
		const label = store_data.title
		const message = `${store_data.title} - your payment - ${tx.id}`
		const memo = tx.id
		const url = encodeURL({
			recipient,
			amount,
			splToken,
			reference,
			label,
			message,
			memo,
		})
		const qrCode = createQR(url)
		console.log(qrCode)
		let signatureInfo

		const { signature } = await new Promise((resolve, reject) => {
			/**
			 * Retry until we find the transaction
			 *
			 * If a transaction with the given reference can't be found, the `findTransactionSignature`
			 * function will throw an error. There are a few reasons why this could be a false negative:
			 *
			 * - Transaction is not yet confirmed
			 * - Customer is yet to approve/complete the transaction
			 *
			 * You can implement a polling strategy to query for the transaction periodically.
			 */
			var a = false
			const interval = setInterval(async () => {
			try {
				signatureInfo = await findTransactionSignature(
					connection,
					reference,
					undefined,
					'confirmed'
				)
				if(!a) {
					a = true; 
					var txId = await createTransaction(email, tx.fields, '', '', currency.name, signatureInfo.signature.toString(), 0, [], tx.price)
					updateIntent({
						id: tx.id,
						is_paid: true,
						transaction_hash: signatureInfo.signature.toString(),
						from_data: {
							email: email
						}
					})
					toast.success('Payment Successful')
					// setIsModalOpen(false)
				}
				clearInterval(interval)
				resolve(signatureInfo)
			} catch (error: any) {
				if (!(error instanceof FindTransactionSignatureError)) {
					console.error(error)
					clearInterval(interval)
					reject(error)
				}
			}
			}, 250)
		})

		// Update payment status
		var paymentStatus = 'confirmed'

		/**
		 * Validate transaction
		 *
		 * Once the `findTransactionSignature` function returns a signature,
		 * it confirms that a transaction with reference to this order has been recorded on-chain.
		 *
		 * `validateTransactionSignature` allows you to validate that the transaction signature
		 * found matches the transaction that you expected.
		 */
		console.log('\n6. 🔗 Validate transaction \n')

		try {
			await validateTransactionSignature(
				connection,
				signature,
				recipient,
				amount,
				undefined,
				reference
			)

			// Update payment status
			paymentStatus = 'validated'
			// @ts-ignore
			// await updateTransaction(txId, true, signatureInfo?.signature)
		} catch (error) {
			console.error('❌ Payment failed', error)
		}
	}

	return [address, connectSOL, paySOL, paySPL, qrCodeSOL, qrCodeSPL] as any
}

export default useSolana