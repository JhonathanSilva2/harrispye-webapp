import { LoginForm } from "@/components/auth/login-form";
import AuthFrame from "../_components/auth-frame";

export default function SignIn({
    params,
    searchParams,
}: {
    params?: Promise<{ slug: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    return (
        <AuthFrame
            title="Login"
            description="Enter your credentials below to access your account"
        >
            <LoginForm />
        </AuthFrame>
    );
}
