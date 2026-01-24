import { createFileRoute } from "@tanstack/react-router";
import AuthContainer from "@/features/auth/AuthContainer";
import { ForgetPasswordForm } from "@/features/auth/ForgetPasswordForm";

export const Route = createFileRoute("/_rootLayout/_auth/forget-password")({
	component: () => (
		<div className="flex items-center justify-center">
			<AuthContainer className="w-120 max-h-154 bg-background border border-border">
				<ForgetPasswordForm />
			</AuthContainer>
		</div>
	),
});
