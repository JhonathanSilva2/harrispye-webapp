"use client";

import { AutobudgetProvider } from "../_providers/autobudget-context";
import LooseMaterial from "./looseMaterial";
import Manual from "./manual";
import Piping from "./piping";
import Service from "./service";
import Totals from "./totals";

export default function AutoBudget() {
	return (
		<AutobudgetProvider>
			<div className="flex flex-col gap-2">
				<Piping />
				<LooseMaterial />
				<Manual />
				<Service className="mb-20" />
				<Totals />
			</div>
		</AutobudgetProvider>
	);
}
