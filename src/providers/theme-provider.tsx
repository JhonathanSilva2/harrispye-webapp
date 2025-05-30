"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ComponentProps, ReactNode, useEffect, useState } from "react";

export default function ThemeProvider({
	children,
	...props
}: ComponentProps<typeof NextThemesProvider> & {
	children: ReactNode;
}) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
			{...props}
		>
			{children}
		</NextThemesProvider>
	);
}
