import { PageProps } from "@/app/types";
import { Searchable } from "@/components/data-table/types";
import FabMonTable from "./_components/fab-mon-spools";

export default async function JobPage({ searchParams, params }: PageProps) {

	const advancedSearch: Searchable[] = [
		{
			key: "id",
			type: "text",
			title: "ID",
		},
	];

	const hp = (await params).job;

	return <FabMonTable hp={hp} />;
}
