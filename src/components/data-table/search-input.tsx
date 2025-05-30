/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { debounce } from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useState } from "react";

interface Props {
	search?: string;
	placeholder: string;
	defaultSearchKey?: string;
}

/**
 * @todo instead of "search" being used as a query parameter, it should be from props and "search" should be it's default value
 */
const SearchInput = ({ search, placeholder, defaultSearchKey }: Props) => {
	search = search || "";
	const [isLoading, setIsLoading] = useState(false);
	const [newSearch, setNewSearch] = useState(search);
	const handleNewSearch = (e: ChangeEvent<HTMLInputElement>) => {
		setNewSearch(e.target.value);
	};
	const [progressValue, setProgressValue] = useState(0);
	const searchParams = useSearchParams();
	const router = useRouter();

	defaultSearchKey = defaultSearchKey || "search";

	const debouncedFetch = useCallback(
		debounce(async (search: string) => {
			setIsLoading(true);
			const params = new URLSearchParams(searchParams);
			params.set(
				defaultSearchKey,
				search?.toString().replace(" ", "-").toUpperCase() || "",
			);
			params.set("page", "1");
			router.push("?" + params.toString());
			setIsLoading(false);
			setProgressValue(100);
		}, 2000),
		[searchParams],
	);

	useEffect(() => {
		setNewSearch(search);
	}, [search]);

	useEffect(() => {
		setProgressValue(0);
		const interval = setInterval(() => {
			setProgressValue((prev) => (prev < 90 ? prev + 1 : prev));
		}, 20);
		debouncedFetch(newSearch);
		return () => clearInterval(interval);
	}, [newSearch]);

	const progress = () => progressValue > 0 && progressValue < 100;

	return (
		<div className="flex flex-col justify-end">
			{progress() ? (
				<Progress
					className="absolute left-0 top-0 z-50 h-0.5 w-full"
					value={progressValue}
				/>
			) : null}
			<Input
				type="search"
				placeholder={placeholder}
				value={newSearch}
				onChange={handleNewSearch}
				disabled={isLoading}
			/>
		</div>
	);
};

export default SearchInput;
