"use client";

import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { clientEnv } from "@/lib/constants/config";

interface ButtonActionProps extends ButtonProps {
	view: string | number;
}

const ButtonAction = (props: ButtonActionProps) => {
	const router = useRouter();
	const { view, ...rest } = props;
	return (
		<Button
			{...props}
			onClick={(e) => {
				if (props.onClick) {
					props.onClick(e);
				}
				e.preventDefault();
				router.push(
					`${clientEnv.NEXT_PUBLIC_URL}/i/fabrication-monitoring/${view}`,
				);
			}}
		/>
	);
};

export default ButtonAction;
