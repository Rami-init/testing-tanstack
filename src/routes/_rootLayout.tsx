import { Outlet, createFileRoute } from "@tanstack/react-router";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const Route = createFileRoute("/_rootLayout")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-col min-h-svh">
			<Header />
			<Outlet />
			<Footer />
		</div>
	);
}
