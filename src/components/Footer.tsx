import { ContactForm } from "./ContactForm";
import FaceBookIcon from "@/assets/icons/FacebookIcon";
import InstagramIcon from "@/assets/icons/InstagramIcon";
import XIcon from "@/assets/icons/XIcon";
import { Icon } from "@/lib/Icon";
import { cn } from "@/lib/utils";

const Footer = () => {
	return (
		<div className="flex py-14 bg-linear-to-br from-[#0B0B0B] to-[#383638] ">
			<div className="w-full container mx-auto grid md:grid-cols-2 gap-8">
				<ContactForm />
				<div className="flex flex-col flex-1 h-full justify-between">
					<div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-16">
						<FooterList
							items={["Home", "Products", "About", "Services", "Contact"]}
							title="Info"
						/>
						<FooterList
							items={["Gallery", "Technologies", "Contact"]}
							title="About Us"
						/>
						<img
							src="./logo.svg"
							alt="Logo"
							width={64}
							height={64}
							className="inline-block mb-4 justify-self-end"
						/>
						<FooterList
							items={[
								"help@exiphones.com",
								"+30-698-545-2831",
								"Support Center",
							]}
							title="Contact Us"
						/>
					</div>
					<div className="flex justify-between">
						<div className="flex gap-2 items-center">
							<IconLink icon={FaceBookIcon} href="https://www.facebook.com" />
							<IconLink icon={InstagramIcon} href="https://www.instagram.com" />
							<IconLink icon={XIcon} href="https://www.twitter.com" />
						</div>
						<p className="text-sm text-muted-foreground">
							© 2023 ex-iphones. All rights reserved.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};
export const IconLink = ({
	icon,
	href,
	className,
	classNameIcon,
}: {
	icon: React.FC<React.SVGProps<SVGSVGElement>>;
	href: string;
	className?: string;
	classNameIcon?: string;
}) => {
	return (
		<a
			href={href}
			className={cn(
				"hover:text-white text-muted-foreground border border-white/10 p-2 rounded-full",
				className
			)}
		>
			<Icon icon={icon} className={cn("text-white w-4 h-4", classNameIcon)} />
		</a>
	);
};
export const FooterList = ({
	items,
	title,
}: {
	items: Array<string>;
	title: string;
}) => {
	return (
		<section className="flex flex-col gap-6">
			<h2 className="text-primary font-bold text-[10px] uppercase">{title}</h2>
			<ul className="flex flex-col space-y-0.5">
				{items.map((item, index) => (
					<li
						key={index}
						className="text-sm text-muted-foreground hover:text-white cursor-pointer font-bold"
					>
						{item}
					</li>
				))}
			</ul>
		</section>
	);
};
export default Footer;
