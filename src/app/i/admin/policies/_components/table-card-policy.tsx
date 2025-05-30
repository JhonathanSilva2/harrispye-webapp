import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { DictionaryList } from "../types";

export function TableCardPolicy({ dictList }: { dictList?: DictionaryList[] }) {
	if (!dictList || dictList.length === 0) {
		return null;
	}
	const headers = Object.keys(dictList[0]);
	return (
		<Table className="text-center">
			<TableHeader>
				<TableRow>
					{headers.map((header) => (
						<TableHead key={header}>
							{header.toUpperCase()}
						</TableHead>
					))}
				</TableRow>
			</TableHeader>
			<TableBody>
				{dictList.map((dict) => (
					<TableRow
						key={String(dict[headers[0] as keyof typeof dict])}
					>
						{headers.map((header) => (
							<TableCell key={header}>{dict[header]}</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
