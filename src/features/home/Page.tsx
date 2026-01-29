import { Outlet } from '@tanstack/react-router'
import { motion } from 'motion/react'
import AppleWatchBanner from './AppleWatchBanner'
import AppleWatchProducts from './AppleWatchProducts'
import Categories from './Categories'
import Header from './HomeHeader'
import IphoneBanner from './IphoneBanner'
import IphoneCollection from './IphoneCollection'
import NewsLetterSection from './NewsLetterSection'
import Footer from '@/components/Footer'

const Page = () => {
  return (
    <div className="flex flex-col max-w-svw overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring', bounce: 0.3 }}
      >
        <Header />
      </motion.div>
      <div>
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, type: 'spring', bounce: 0.3 }}
        >
          <Categories />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.25 }}
        >
          <IphoneBanner />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: -10 }}
          whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
        >
          <IphoneCollection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.25 }}
        >
          <AppleWatchBanner />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: 10 }}
          whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
        >
          <AppleWatchProducts />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, type: 'spring', bounce: 0.3 }}
        >
          <NewsLetterSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, type: 'spring', bounce: 0.2 }}
        >
          <Outlet />
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}

export default Page
