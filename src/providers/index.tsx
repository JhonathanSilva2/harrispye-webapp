"use client";

import QueryProvider from "./query-provider";
import ThemeProvider from "./theme-provider";

const providers = [QueryProvider, ThemeProvider] as React.ComponentType<{
	children: React.ReactNode;
}>[];

export default function Providers({ children }: { children: React.ReactNode }) {
	return providers.reduceRight(
		(acc, Provider) => <Provider>{acc}</Provider>,
		children
	);
}
