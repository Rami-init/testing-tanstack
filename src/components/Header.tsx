import { Link } from "@tanstack/react-router";
import { Heart, ShoppingCart, UserRound } from "lucide-react";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

const Header = () => {
	return (
		<header className="flex items-center justify-between fixed bg-background w-full top-0 left-0 right-0 h-16 shadow-md z-10">
			<div className="container mx-auto flex items-center justify-between h-full">
				<Link to="/" className="flex items-center">
					<img
						src="./logo.svg"
						alt="Logo"
						width={32}
						height={32}
						className="inline-block mr-1"
					/>
					<h1 className="text-base font-medium text-heading">ex-iphones</h1>
				</Link>
				<ul className="flex text-heading font-bold text-base h-full">
					<LinkItem to="/">Home</LinkItem>
					<LinkItem to="/products">Products</LinkItem>

					<LinkItem to="/about">About</LinkItem>

					<LinkItem to="/contact">Contact</LinkItem>
				</ul>
				<LoginLink />
			</div>
		</header>
	);
};
const LoginLink = () => {
	const session = authClient.useSession();
	if (session.data?.user) {
		return (
			<div className="flex items-center gap-x-4 h-full">
				<div className="relative">
					<ShoppingCart className="text-heading cursor-pointer" />
					<span className="flex items-center justify-center absolute -top-1.5 -right-2 rounded-full bg-[#3858D6] text-white text-sm p-0.5 size-4">
						3
					</span>
				</div>
				<Heart className="text-heading cursor-pointer" />
				<UserRound className="text-heading cursor-pointer" />
			</div>
		);
	}
	return (
		<div className="flex items-center gap-x-0.5 text-heading font-bold text-base h-full">
			<LinkItem to="/login" className="border-none py-2">
				Login
			</LinkItem>
			<Separator orientation="vertical" className="h-5! w-0.5! bg-heading" />
			<LinkItem to="/signup" className="border-none py-2">
				Sign Up
			</LinkItem>
		</div>
	);
};

const LinkItem = ({
	to,
	children,
	className,
}: {
	to: string;
	children: string;
	className?: string;
}) => (
	<Link
		to={to}
		className={cn(
			"border-b-2 border-transparent hover:border-current px-2 h-full flex items-center hover:text-primary transition cursor-pointer",
			className
		)}
	>
		{children}
	</Link>
);
export default Header;
