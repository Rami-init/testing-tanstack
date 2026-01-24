import { Link } from "@tanstack/react-router";
import { MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription } from "@/components/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";

export function ForgetPasswordForm() {
	return (
		<form className="flex flex-col gap-5">
			<div className="grid gap-2">
				<Label htmlFor="email" className="text-heading">
					Email
				</Label>
				<InputGroup className="bg-white">
					<InputGroupInput type="email" placeholder="ex@example.com" />
					<InputGroupAddon>
						<MailIcon />
					</InputGroupAddon>
				</InputGroup>
				<p className="text-sm text-muted-foreground">
					Please enter your email to receive password reset instructions.
				</p>
			</div>

			<Field>
				<Button type="submit">Reset Password</Button>
				<Link
					to="/login"
					type="button"
					className="text-heading bg-white hover:bg-white/70 transition w-full text-center mt-2 rounded-md px-3 py-2 font-semibold border border-border"
				>
					Back to Login
				</Link>
				<FieldDescription className="text-center">
					Don&apos;t have an account?{" "}
					<Link to="/signup" className="text-primary font-semibold">
						Sign up now
					</Link>
				</FieldDescription>
			</Field>
		</form>
	);
}
