import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_rootLayout/products")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="h-40 bg-amber-400">Hello "/_rootLayout/products"!</div>
	);
}
