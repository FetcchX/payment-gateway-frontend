import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import Link from 'next/link'

interface Props {
	transaction: any
	isOpen: boolean
	closeModal: Function
	openModal: Function
}

export default function TransactionModal(props: Props) {
  return (
    <>
	    <Transition appear show={props.isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => props.closeModal()}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="font-urban inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {props.transaction.name}
                </Dialog.Title>
				<div className="mt-2 flex flex-col justify-center items-center space-y-3">
					<h1 className='text-xl'>Email: {props.transaction.email}</h1>
					{console.log(props.transaction)}
					{props.transaction.eth_address && 
						<div className='bg-cyan-400/20 rounded-xl p-3 flex justify-center items-center'>
							{!props.transaction.transaction_hash ? <span>❌</span> : <span>✅</span>}	
							<a target='_blank' href={`https://etherscan.io/tx/${props.transaction.transaction_hash}`} className='flex space-x-3'>
								<span>See Transaction on</span> <img src="https://etherscan.io/images/brandassets/etherscan-logo.png" className='w-28' alt="" />
							</a>
						</div>	
					}
					{props.transaction.sol_address && 
						<div className='bg-cyan-400/20 rounded-xl p-3 flex justify-center items-center'>
							{!props.transaction.transaction_hash ? <span>❌</span> : <span>✅</span>}	
							<a target='_blank' href={`https://solscan.io/tx/${props.transaction.transaction_hash}`} className='flex space-x-3'>
								<span>See Transaction on</span> <img src="https://solscan.io/static/media/solana-solana-scan-blue.5ffb9996.svg" className='w-14' alt="" />
							</a>
						</div>
					}
          {console.log(props.transaction)}
					{/* <p className='flex space-x-2 font-bold'><span className='font-normal'>Store:</span><Link href={`/${props.transaction.page.slug}`}>{props.transaction.page.title}</Link></p> */}
					<p className=''>Amount: <span className='font-bold'>$ {props.transaction.total_prices}</span></p>
					<h1 className='text-xl font-bold'>Field Values</h1>
					{props.transaction.fields && props.transaction.fields.map((value: any) => {
						return <div key={value.name} className='flex space-x-3'>
							<p>{value.name}: </p>
							<p>{value.value}</p>
						</div>
					})}
					<h1 className='text-xl font-bold'>Selected Products</h1>
					{props.transaction.products && props.transaction.products.map((product: any) => {
						return <div key={product.name} className='flex space-x-3'>
							<p>{product.name}</p>
							<p>{product.discounted_price}</p>
						</div>
					})}
				</div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={() => props.closeModal()}
                  >
                    Got it, thanks!
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
