import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

import NotFoundImage from "@/assets/not-found.png";

import { cn } from "@/lib/utils";

export default function NotFound({
	className,
	title = "Page Not Found",
	code = "404",
	withLink = true,
	content = "The requested page is not available",
	children,
	...props
}: React.ComponentProps<"div"> & {
	title?: string;
	code?: string;
	content?: string;
	path?: string;
	pathLabel?: string;
	withLink?: boolean;
	children?: React.ReactNode;
}) {
	return (
		<div
			{...props}
			className={cn(
				"flex flex-1 flex-col items-center justify-center w-full h-full space-y-5",
				className
			)}
		>
			<img
				src={NotFoundImage}
				alt="Not Found"
				width={252}
				height={175}
				className="w-63 h-43.75"
			/>
			<div className="flex flex-col items-center justify-center space-y-2">
				<h3 className="text-5xl font-bold text-text-light">{code}</h3>
				<h1 className="text-xl font-bold text-text-primary text-center">
					{title}
				</h1>
				<p className="text-base text-large-regular text-text-primary">
					{content}
				</p>
			</div>
			{withLink ? (
				<Button asChild>
					<Link to="/">Go Home</Link>
				</Button>
			) : (
				children
			)}
		</div>
	);
}
