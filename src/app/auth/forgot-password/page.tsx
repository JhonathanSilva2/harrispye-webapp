import ForgotPasswordForm from "@/components/auth/forgot-password-form";
import AuthFrame from "../_components/auth-frame";

export default async function ForgotPassword() {
	return (
		<AuthFrame
			title="Forgot Password"
			description="Recover Password to Portal"
		>
			<ForgotPasswordForm />
		</AuthFrame>
	);
}
