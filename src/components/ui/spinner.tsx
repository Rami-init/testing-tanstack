import React from "react";
import { cn } from "@/lib/utils";

const Spinner = ({ className, ...props }: React.HTMLProps<HTMLDivElement>) => (
	<div
		className={cn(
			"w-5 h-5 border-[3px] border-transparent border-t-base-white border-r-base-white rounded-full animate-spin",
			className
		)}
		{...props}
	/>
);
export default Spinner;
