"use client";

import { Button } from "@/components/ui/button";
import { clientEnv } from "@/lib/constants/config";
import { Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import AuthFrame from "../_components/auth-frame";

const Logout = () => {
	const [isLoading, setIsLoading] = useState(false);

	const onSubmit = async () => {
		setIsLoading(true);
		await signOut({
			redirect: true,
			callbackUrl: clientEnv.NEXT_PUBLIC_URL,
		});
		setIsLoading(false);
	};

	return (
		<>
			<AuthFrame
				title="Logout"
				description="Are you sure you want to log out?"
			>
				<Button
					className=""
					type="button"
					onClick={onSubmit}
					disabled={isLoading}
				>
					{isLoading && <Loader2 className="w-2 animate-spin" />}
					Logout
				</Button>
			</AuthFrame>
		</>
	);
};

export default Logout;
