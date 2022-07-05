import Head from 'next/head'

import Banner from '../components/features/Banner'
import Feature from '../components/features/Feature'

const Points = [
  {
    invert: true,
    for: 'For Businesses',
    title: 'Wonderful and Effortless way to view your total Balance Balance',
    desc: 'Millions of businesses of all sizes—from startups to large enterprises—use Wagpay’s software and APIs to accept payments, send payouts, and manage their businesses online  their businesses online.',
  },
  {
    invert: false,
    for: 'For Businesses',
    title: 'Wonderful and Effortless way to view your total Balance Balance',
    desc: 'Millions of businesses of all sizes—from startups to large enterprises—use Wagpay’s software and APIs to accept payments, send payouts, and manage their businesses online  their businesses online.',
  },
  {
    invert: true,
    for: 'For Businesses',
    title: 'Wonderful and Effortless way to view your total Balance Balance',
    desc: 'Millions of businesses of all sizes—from startups to large enterprises—use Wagpay’s software and APIs to accept payments, send payouts, and manage their businesses online  their businesses online.',
  },
]

const Features: React.FC = () => {
  return (
    <>
      <div className='w-full h-full bg-[#6C7EE1]/20 space-y-10 xl:space-y-0 pt-20'>
        <Banner />
        <div className="flex flex-col pt-20 space-y-10 lg:space-y-4 justify-center items-center">
          {Points.map((value: any) => (
            <Feature {...value} />
          ))}
        </div>
      </div>
    </>
  )
}

export default Features