import { Link } from '@tanstack/react-router'
import ThreeIphoneImage from '@/assets/three-iphone.png'
import { Button } from '@/components/ui/button'

const IphoneBanner = () => {
  return (
    <section className="flex bg-black flex-col items-center  justify-center mx-auto  pt-20 gap-y-20 w-full">
      <div className="flex flex-col gap-y-2 text-center items-center">
        <h2 className="text-white text-5xl font-semibold">All PhoneX Models</h2>
        <p className="text-white text-lg">
          from $699.00 or $29.12/mo. for 24 mo. before trade‑in, plus tax.{' '}
        </p>
        <div className="flex items-center gap-4">
          <Button size="lg" className="px-8" asChild>
            <Link to="/products">Buy</Link>
          </Button>
          <Button
            variant="link"
            size="lg"
            className="px-8 font-bold text-lg"
            asChild
          >
            <Link to="/about">Learn More</Link>
          </Button>
        </div>
      </div>
      <img
        src={ThreeIphoneImage}
        alt="Three PhoneX Models"
        className="w-225 h-auto"
      />
    </section>
  )
}

export default IphoneBanner
