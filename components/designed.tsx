import Hero from '../components/designed/hero'
import DoubleCard from '../components/designed/DoubleCard'

const Points = [
  {
    invert: true,
    for: 'For Businesses',
    title: 'The world’s most powerful and easy-to-use APIs',
    desc: 'Millions of businesses of all sizes—from startups to large enterprises—use Wagpay’s software and APIs to accept payments, send payouts, and manage their businesses online.',
    point1: 'Point 1',
    point1desc: 'Millions of businesses of all sizes—from startups to large enterprises—use Wagpay’s software and APIs',
    point2: 'Point 1',
    point2desc: 'Millions of businesses of all sizes—from startups to large enterprises—use Wagpay’s software and APIs',
  },
  {
    invert: false,
    for: 'For SMBs',
    title: 'The world’s most powerful and easy-to-use APIs',
    desc: 'Millions of businesses of all sizes—from startups to large enterprises—use Wagpay’s software and APIs to accept payments, send payouts, and manage their businesses online.',
    point1: 'Point 1',
    point1desc: 'Millions of businesses of all sizes—from startups to large enterprises—use Wagpay’s software and APIs',
    point2: 'Point 1',
    point2desc: 'Millions of businesses of all sizes—from startups to large enterprises—use Wagpay’s software and APIs',
  }
]

const Designed: React.FC = () => {
  return (
    <>
      <div className='w-full h-full  bg-[#6C7EE1]/20 space-y-10 xl:space-y-0 pt-20'>
        <Hero></Hero>
        <div className="flex flex-col space-y-20 lg:space-y-20 xl:space-y-20 justify-center items-center">
          {Points.map((value: any) => (
            <DoubleCard {...value}></DoubleCard>
          ))}
        </div>
      </div>
    </>
  )
}

export default Designed