import ResetPasswordForm from "@/components/auth/reset-password-form";
import AuthFrame from "../../_components/auth-frame";

export default async function ResetPassword({
	params,
}: {
	params: Promise<{ token: string }>;
}) {
	const token = (await params).token;
	return (
		<AuthFrame
			title="Forgot Password"
			description="Recover Password for Portal"
		>
			<ResetPasswordForm token={token} />
		</AuthFrame>
	);
}
