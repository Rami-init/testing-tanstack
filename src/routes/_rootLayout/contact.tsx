import { createFileRoute } from "@tanstack/react-router";
import ContactPage from "@/features/contact/ContactPage";

export const Route = createFileRoute("/_rootLayout/contact")({
	component: RouteComponent,
});

function RouteComponent() {
	return <ContactPage />;
}
