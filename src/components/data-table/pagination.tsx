import React from "react";
import { Button } from "../ui/button";
import { ChevronFirst, ChevronLast } from "lucide-react";

interface PaginationProps {
	firstPage: () => void;
	previousPage: () => void;
	nextPage: () => void;
	lastPage: () => void;
	getCanPreviousPage: () => boolean;
	getCanNextPage: () => boolean;
	tableState: number;
}

const Pagination = ({
	getCanPreviousPage,
	firstPage,
	previousPage,
	nextPage,
	lastPage,
	getCanNextPage,
	tableState,
}: PaginationProps) => {
	return (
		<div className={`flex justify-center gap-1`}>
			{getCanPreviousPage() && (
				<>
					<Button
						variant="outline"
						disabled={!getCanPreviousPage()}
						onClick={() => firstPage()}
					>
						<ChevronFirst />
					</Button>
					<Button
						variant="outline"
						disabled={!getCanPreviousPage()}
						onClick={() => previousPage()}
					>
						<p>{tableState}</p>
					</Button>
				</>
			)}
			{getCanNextPage() || getCanPreviousPage() ? (
				<Button className="bg-gray-800 text-white" variant="outline">
					<p>{tableState + 1}</p>
				</Button>
			) : null}
			{getCanNextPage() && (
				<>
					<Button
						variant="outline"
						disabled={!getCanNextPage()}
						onClick={() => nextPage()}
					>
						<p>{tableState + 2}</p>
					</Button>
					<Button
						variant="outline"
						disabled={!getCanNextPage()}
						onClick={() => lastPage()}
					>
						<ChevronLast />
					</Button>
				</>
			)}
		</div>
	);
};

export default Pagination;
