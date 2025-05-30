"use client";

import {
	ChevronFirst,
	ChevronLast,
	ChevronLeft,
	ChevronRight,
	Ellipsis,
} from "lucide-react";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
	className?: string;
	itemCount: number;
	pageSize?: number;
	currentPage: number;
}

const Pagination = ({
	className,
	itemCount,
	pageSize = 10,
	currentPage,
}: Props) => {
	const pageCount = Math.ceil(itemCount / pageSize);
	const router = useRouter();
	const searchParams = useSearchParams();

	if (pageCount <= 1) return null;

	const changePage = (page: number) => {
		const params = new URLSearchParams(searchParams);
		params.set("page", page.toString());
		router.push("?" + params.toString());
	};
	return (
		<div className={`flex justify-center gap-1 ${className || ""}`}>
			<Button
				variant="outline"
				disabled={currentPage === 1}
				onClick={() => changePage(1)}
			>
				<ChevronFirst />
			</Button>
			{currentPage - 1 >= 1 && (
				<Button
					variant="outline"
					disabled={currentPage === 1}
					onClick={() => changePage(currentPage - 1)}
				>
					<p>{currentPage - 1}</p>
				</Button>
			)}
			<Button
				className="bg-gray-500 text-white"
				variant="outline"
				disabled
			>
				<p>{currentPage}</p>
			</Button>
			{currentPage + 1 <= pageCount && (
				<>
					<Button
						variant="outline"
						disabled={currentPage === pageCount}
						onClick={() => changePage(currentPage + 1)}
					>
						<p>{currentPage + 1}</p>
					</Button>
				</>
			)}
			<Button
				variant="outline"
				disabled={currentPage === pageCount}
				onClick={() => changePage(pageCount)}
			>
				<ChevronLast />
			</Button>
		</div>
	);
};

export default Pagination;
