import Banner from './how/Banner'
import Steps from './how/Steps'
import Cards from './how/Cards'

const How: React.FC = () => {
  return (
    <>
      <div className='w-full h-full xl:h-screen bg-[#6C7EE1]/20'>
        <Banner></Banner>
        <Steps></Steps>
        <Cards></Cards>
      </div>
    </>
  )
}

export default How