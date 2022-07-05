import {
  CollectionIcon,
  CogIcon,
  CreditCardIcon,
  HomeIcon,
  MenuAlt1Icon,
  QuestionMarkCircleIcon,
  ShoppingCartIcon,
  ScaleIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  XIcon,
} from '@heroicons/react/outline'
import {
  CashIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  OfficeBuildingIcon,
  SearchIcon,
} from '@heroicons/react/solid'
import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import Link from 'next/link'
import usePages from '../../hooks/usePage'
import { Page } from 'Pages'
import useTransactions from '../../hooks/useTransactions'
import { Transaction } from '../../types/Transaction'
import useProducts from '../../hooks/useProducts'

const statusStyles = {
  success: 'bg-green-100 text-green-800',
  processing: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-gray-100 text-gray-800',
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export const Ethereum = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlSpace="preserve"
      className="h-5 w-5"
      version="1.1"
      shape-rendering="geometricPrecision"
      text-rendering="geometricPrecision"
      image-rendering="optimizeQuality"
      fill-rule="evenodd"
      clip-rule="evenodd"
      viewBox="0 0 784.37 1277.39"
    >
      <g id="Layer_x0020_1">
        <metadata id="CorelCorpID_0Corel-Layer" />
        <g id="_1421394342400">
          <g>
            <polygon
              fill="#343434"
              fill-rule="nonzero"
              points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54 "
            />
            <polygon
              fill="#8C8C8C"
              fill-rule="nonzero"
              points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33 "
            />
            <polygon
              fill="#3C3C3B"
              fill-rule="nonzero"
              points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89 "
            />
            <polygon
              fill="#8C8C8C"
              fill-rule="nonzero"
              points="392.07,1277.38 392.07,956.52 -0,724.89 "
            />
            <polygon
              fill="#141414"
              fill-rule="nonzero"
              points="392.07,882.29 784.13,650.54 392.07,472.33 "
            />
            <polygon
              fill="#393939"
              fill-rule="nonzero"
              points="0,650.54 392.07,882.29 392.07,472.33 "
            />
          </g>
        </g>
      </g>
    </svg>
  )
}

export const Solana = () => {
  return (
    <img
      src="https://cryptologos.cc/logos/solana-sol-logo.png?v=022"
      className="h-5 w-5"
    />
  )
}

interface Props {
  cards: any[]
  username: string
}

const Overview = ({ cards, username }: Props) => {
  const [transactions, getTransactions] = useTransactions()
  const [pages, getPages] = usePages()

  useEffect(() => getTransactions(), [])

  return (
    <div className="mt-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-medium leading-6 text-gray-900">
          Overview
        </h2>
        <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Card */}
          {cards.map((card) => (
            <div
              key={card.name}
              className="overflow-hidden rounded-lg bg-white shadow"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <card.icon
                      className="h-6 w-6 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        {card.name}
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {card.amount}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <a
                    href={card.href}
                    className="font-medium text-indigo-700 hover:text-indigo-900"
                  >
                    View all
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <h2 className="mx-auto mt-8 max-w-6xl px-4 text-lg font-medium leading-6 text-gray-900 sm:px-6 lg:px-8">
        Recent activity
      </h2>

      {/* Activity list (smallest breakpoint only) */}
      <div className="shadow sm:hidden">
        <ul
          role="list"
          className="mt-2 divide-y divide-gray-200 overflow-hidden shadow sm:hidden"
        >
          {transactions &&
            transactions.length > 0 &&
            transactions.map((transaction: Transaction) => (
              // <li key={transaction.id}>
              //   <a
              //     href={transaction.href}
              //     className="block bg-white px-4 py-4 hover:bg-gray-50"
              //   >
              //     <span className="flex items-center space-x-4">
              //       <span className="flex flex-1 space-x-2 truncate">
              //         <CashIcon
              //           className="h-5 w-5 flex-shrink-0 text-gray-400"
              //           aria-hidden="true"
              //         />
              //         <span className="flex flex-col truncate text-sm text-gray-500">
              //           <span className="truncate">
              //             {transaction.productName}
              //           </span>
              //           <span>
              //             <span className="font-medium text-gray-900">
              //               {transaction.amount}
              //             </span>{' '}
              //             {transaction.currency}
              //           </span>
              //           <time dateTime={transaction.datetime}>
              //             {transaction.date}
              //           </time>
              //         </span>
              //       </span>
              //       <ChevronRightIcon
              //         className="h-5 w-5 flex-shrink-0 text-gray-400"
              //         aria-hidden="true"
              //       />
              //     </span>
              //   </a>
              // </li>
              <li></li>
            ))}
        </ul>

        <nav
          className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3"
          aria-label="Pagination"
        >
          <div className="flex flex-1 justify-between">
            <a
              href="#"
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
            >
              Previous
            </a>
            <a
              href="#"
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
            >
              Next
            </a>
          </div>
        </nav>
      </div>

      {/* Activity table (small breakpoint and up) */}
      <div className="hidden sm:block">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mt-2 flex flex-col">
            <div className="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Invoice
                    </th>
                    <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Transaction
                    </th>
                    <th className="bg-gray-50 px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Page Name
                    </th>
                    <th className="bg-gray-50 px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Amount
                    </th>
                    <th className="hidden bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 md:block">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {transactions && transactions.data.length > 0 && console.log(transactions.data[0] !== {})}
                  {transactions &&
                    transactions.data.length > 0 &&
                    !transactions.data[0] &&
                    transactions.data.map((transaction: Transaction) => (
                      <tr key={transaction.id} className="bg-white">
                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-500">
                          {transaction.id}
                        </td>
                        <td className="w-full max-w-0 whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          <div className="flex">
                            <a
                              // href={transaction.href}
                              className="group inline-flex space-x-2 truncate text-sm"
                            >
                              <p className="truncate text-gray-500 group-hover:text-gray-900">
                                {transaction.name} ({transaction.email})
                              </p>
                            </a>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-500">
                          <Link href={`/${username}/${transaction.page.slug as string}`}>
                            {transaction.page.title}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                          <span className="font-medium text-gray-900">
                            ${transaction.total_prices}{' '}
                          </span>
                          USD
                        </td>
                        <td className="hidden whitespace-nowrap px-6 py-4 text-sm text-gray-500 md:block">
                          <span
                            className={classNames(
                              // @ts-ignore
                              // statusStyles[transaction.status],
                              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize'
                            )}
                          >
                            {transaction.currency === 'ethereum' && (
                              <>
                                {!transaction.transaction_hash ? (
                                  <span>❌</span>
                                ) : (
                                  <span>✅</span>
                                )}
                                <a
                                  href={`https://etherscan.io/tx/${transaction.transaction_hash}`}
                                  className="flex space-x-3"
                                >
                                  <span>See Transaction on</span>{' '}
                                  <img
                                    src="https://etherscan.io/images/brandassets/etherscan-logo.png"
                                    className="w-14"
                                    alt=""
                                  />
                                </a>
                              </>
                            )}
                            {transaction.currency === 'solana' && (
                              <>
                                {!transaction.transaction_hash ? (
                                  <span>❌</span>
                                ) : (
                                  <span>✅</span>
                                )}
                                <a
                                  href={`https://solscan.io/tx/${transaction.transaction_hash}`}
                                  className="flex space-x-3"
                                >
                                  <span>See Transaction on</span>{' '}
                                  <img
                                    src="https://solscan.io/static/media/solana-solana-scan-blue.5ffb9996.svg"
                                    className="w-14"
                                    alt=""
                                  />
                                </a>
                              </>
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {/* Pagination */}
              {/* <nav
					className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
					aria-label="Pagination"
					>
					<div className="hidden sm:block">
						<p className="text-sm text-gray-700">
						Showing <span className="font-medium">1</span> to{' '}
						<span className="font-medium">10</span> of{' '}
						<span className="font-medium">20</span> results
						</p>
					</div>
					<div className="flex flex-1 justify-between sm:justify-end">
						<a
						href="#"
						className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
						>
						Previous
						</a>
						<a
						href="#"
						className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
						>
						Next
						</a>
					</div>
					</nav> */}
            </div>
          </div>
        </div>
      </div>
      {(!transactions || transactions.data.length <= 0) ? (
        <div className='w-full h-full flex justify-center items-center p-5'>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
      ) : 
        <div className='w-full h-full flex justify-center items-center p-5'>
          <p>No Transactions</p>
        </div>
      }
      <div className="hidden sm:block">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mt-2 flex flex-col">
            <div className="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Store Name
                    </th>
                    <th className="bg-gray-50 px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Description
                    </th>
                    <th className="bg-gray-50 px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Accepted Currencies
                    </th>
                    <th className="bg-gray-50 px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      ETH Address
                    </th>
                    <th className="bg-gray-50 px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      SOL Address
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {pages &&
                    pages.data.length > 0 &&
                    pages.data.map((page: Page) => (
                      <tr key={page.id} className="bg-white">
                        <td className="w-full max-w-0 whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          <div className="flex">
                            <Link href={`/${username}/${page.slug}`}>
                              <a className="group inline-flex space-x-2 truncate text-sm">
                                <p className="truncate text-gray-500 group-hover:text-gray-900">
                                  {page.title}
                                </p>
                              </a>
                            </Link>
                          </div>
                        </td>
                        <td className="w-96 truncate whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                          <span className="inline-flex w-96 items-center truncate rounded-full px-2.5 py-0.5 text-xs font-medium capitalize">
                            {page.description}
                          </span>
                        </td>
                        <td className="flex space-x-3 whitespace-nowrap px-8 pt-3 text-sm text-gray-500">
                          {page.accepted_currencies.map((currency) => (
                            <span className="font-medium text-gray-900">
                              {currency === 'ethereum' && <Ethereum />}
                              {currency === 'solana' && <Solana />}
                              {currency === 'usdcsol' && <Solana />}
                              {currency === 'usdceth' && <Ethereum />}
                            </span>
                          ))}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          <span className="inline-flex w-20 items-center truncate rounded-full px-2.5 py-0.5 text-xs font-medium capitalize">
                            {page.eth_address}
                          </span>
                          ...
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          <span className="inline-flex w-20 items-center truncate rounded-full px-2.5 py-0.5 text-xs font-medium capitalize">
                            {page.sol_address}
                          </span>
                          ...
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {/* Pagination */}
              {/* <nav
					className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
					aria-label="Pagination"
					>
					<div className="hidden sm:block">
						<p className="text-sm text-gray-700">
						Showing <span className="font-medium">1</span> to{' '}
						<span className="font-medium">10</span> of{' '}
						<span className="font-medium">20</span> results
						</p>
					</div>
					<div className="flex flex-1 justify-between sm:justify-end">
						<a
						href="#"
						className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
						>
						Previous
						</a>
						<a
						href="#"
						className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
						>
						Next
						</a>
					</div>
					</nav> */}
            </div>
          </div>
        </div>
        {(!pages || pages.data.length <= 0) ? (
          <div className='w-full h-full flex justify-center items-center p-5'>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : 
        <div className='w-full h-full flex justify-center items-center p-5'>
          <p>No Transactions</p>
        </div>
        }
      </div>
    </div>
  )
}

export default Overview
