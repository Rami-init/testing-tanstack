import { Edit, Timer } from "lucide-react";
import ContactImage from "@/assets/contact-thumb.png";
import FaceBookIcon from "@/assets/icons/FacebookIcon";
import InstagramIcon from "@/assets/icons/InstagramIcon";
import XIcon from "@/assets/icons/XIcon";
import { IconLink } from "@/components/Footer";
import { Separator } from "@/components/ui/separator";

const About = () => {
	return (
		<div className="flex flex-col py-10 container mx-auto mt-16">
			<div>
				<h1 className="text-5xl font-semibold text-heading text-center">
					About the ex.iphones.
				</h1>
				<div className="space-x-4 text-sm text-heading/80 text-center flex items-center justify-center mt-4">
					<h5 className="font-semibold flex items-center gap-1">
						<Edit size={14} /> Αλέξανδρος
					</h5>
					<Separator orientation="vertical" className="h-6! w-0.5!" />
					<h5 className="flex items-center gap-1">
						{" "}
						<Timer size={14} /> 20 September 2023
					</h5>
				</div>
				<img
					src={ContactImage}
					alt="About Us Illustration"
					className="mx-auto mt-10 rounded-lg max-h-96 object-contain"
				/>
				<div className="grid grid-cols-5 mt-20 gap-10 max-w-4xl mx-auto">
					<div className="max-w-2xl mx-auto text-center text-lg text-heading/90 space-y-6 col-span-4">
						<Content title="Who ex.iphones. started">
							ex.iphones. began with a simple idea: to provide high-quality
							refurbished iPhones at affordable prices while promoting
							sustainability and reducing electronic waste.
						</Content>
						<Content title="Our Mission">
							Our mission is to make premium smartphones accessible to everyone,
							while also contributing to a greener planet by extending the life
							of electronic devices.
						</Content>
						<Content title="What We Offer">
							We specialize in refurbishing iPhones to like-new condition,
							ensuring that each device meets rigorous quality standards. Our
							products come with warranties and exceptional customer support.
						</Content>
						<Content title="Things we take for granted">
							In today's fast-paced world, we often take our smartphones for
							granted. At ex.iphones., we recognize the importance of these
							devices in our daily lives and strive to provide reliable and
							affordable options for everyone.
						</Content>
						<Content title="Future of ex.iphones.">
							Looking ahead, we aim to expand our product range and services,
							continuing to innovate in the refurbished electronics market while
							staying true to our core values of quality, sustainability, and
							customer satisfaction.
						</Content>
						<Content title="Something nobody knows about us">
							Did you know that for every iPhone sold, we plant a tree in
							partnership with environmental organizations? It's our way of
							giving back to the planet and promoting sustainability.
						</Content>
						<Content title="Our Values">
							At ex.iphones., we value quality, sustainability, and customer
							satisfaction. We are committed to transparency and integrity in
							all our business practices.
						</Content>
						<Content title="Sustainability Commitment">
							At ex.iphones., we are dedicated to reducing electronic waste by
							refurbishing and reselling used iPhones. We believe in the power
							of technology to connect people while also protecting our planet
							for future generations.
						</Content>
						<Content title="Customer Satisfaction">
							Customer satisfaction is at the heart of everything we do. We
							strive to provide an exceptional shopping experience, from easy
							navigation on our website to responsive customer service.
						</Content>
						<Content title="Join Us on Our Journey">
							We invite you to join us on our journey towards a more sustainable
							future. Whether you're looking for a reliable refurbished iPhone
							or want to learn more about our sustainability efforts, we're here
							to help.
						</Content>
						<Content title="A Message from the Founder">
							Dear Valued Customers, At ex.iphones., we believe in the power of
							technology to connect people and improve lives. We are committed
							to providing you with the best products and service possible.
							Thank you for being a part of our journey towards a more
							sustainable future.
						</Content>
					</div>
					<div className="flex flex-col gap-4 items-center">
						<IconLink
							className="text-heading border-heading hover:bg-heading/10"
							classNameIcon="text-heading"
							icon={FaceBookIcon}
							href="https://www.facebook.com"
						/>
						<IconLink
							className="text-heading border-heading hover:bg-heading/10"
							classNameIcon="text-heading"
							icon={InstagramIcon}
							href="https://www.instagram.com"
						/>
						<IconLink
							className="text-heading border-heading hover:bg-heading/10"
							classNameIcon="text-heading"
							icon={XIcon}
							href="https://www.twitter.com"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
const Content = ({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) => {
	return (
		<div className="flex flex-col gap-y-4 text-heading items-start">
			<h2 className="text-lg font-semibold ">{title}</h2>
			<p className="text-sm text-start">{children}</p>
		</div>
	);
};
export default About;
