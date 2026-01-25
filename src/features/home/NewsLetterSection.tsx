import NewsLettersImage from '@/assets/newsletter.png'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'

const NewsLetterSection = () => {
  return (
    <div className="bg-[#8B8E99]/10 py-20">
      <div className="bg-white rounded-2xl flex items-center justify-center gap-4 container mx-auto px-8 py-10 shadow-lg">
        <div className="flex flex-col gap-3">
          <div>
            <h4 className="text-4xl font-semibold text-[#1E1D1D]">
              Subscribe To Newsletter
            </h4>
            <p className="text-[#8B8E99] text-sm">
              Get the latest updates and offers.
            </p>
          </div>
          <InputGroup className="w-lg h-12 rounded-2xl">
            <InputGroupInput placeholder="Enter your email" />

            <InputGroupAddon align="inline-end">
              <InputGroupButton
                variant="default"
                className="h-10 px-6 rounded-2xl"
              >
                Subscribe
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div>
          <img
            src={NewsLettersImage}
            alt="Newsletter"
            className="w-150 h-auto rounded-lg"
          />
        </div>
      </div>
    </div>
  )
}

export default NewsLetterSection
