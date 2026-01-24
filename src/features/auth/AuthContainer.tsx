import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const AuthContainer = ({
	className,
	children,
	...props
}: React.ComponentProps<"div">) => {
	return (
		<Card className={className} {...props}>
			<CardHeader className="gap-5">
				<CardTitle>
					<div className="flex items-center justify-center">
						<img
							src="./logo.svg"
							alt="Logo"
							width={64}
							height={64}
							className="inline-block mr-1"
						/>
						<h1 className="text-4xl font-medium text-heading">ex-iphones</h1>
					</div>
				</CardTitle>
				<CardDescription className="font-bold text-2xl">Signup</CardDescription>
			</CardHeader>
			<CardContent>{children}</CardContent>{" "}
		</Card>
	);
};

export default AuthContainer;
