"use client";

import { useEffect } from "react";
import { toast } from "sonner";

/**
 * Shouldn't be used as a component, if needed, create it as a hook
 * And make it properly handle the message
 * @param message
 */
const ToastError = ({ message }: { message: string }) => {
	useEffect(() => {
		toast.error(message);
	}, [message]);
	return <></>;
};

export { ToastError };
