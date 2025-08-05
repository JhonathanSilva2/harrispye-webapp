import { ChevronFirst, ChevronLast } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface PaginationProps {
    firstPage: () => void;
    previousPage: () => void;
    nextPage: () => void;
    lastPage: () => void;
    getCanPreviousPage: () => boolean;
    getCanNextPage: () => boolean;
    setPage: (pageIndex: number) => void;
    pageIndex: number;
}

const Pagination = ({
    getCanPreviousPage,
    firstPage,
    previousPage,
    nextPage,
    lastPage,
    getCanNextPage,
    setPage,
    pageIndex,
}: PaginationProps) => {
    const [pageInput, setPageInput] = React.useState(pageIndex + 1);
    const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!/^\d*$/.test(e.target.value)) {
            return; // Prevent non-numeric input
        }
        const value = e.target.value ? Number(e.target.value) : 1;
        if (value < 1) {
            setPageInput(1);
            return; // Prevent negative or zero page numbers
        }
        setPageInput(value);
    };
    return (
        <div className="flex justify-between">
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
                            <p>{pageIndex}</p>
                        </Button>
                    </>
                )}
                {getCanNextPage() || getCanPreviousPage() ? (
                    <Button
                        className="bg-gray-800 text-white"
                        variant="outline"
                    >
                        <p>{pageIndex + 1}</p>
                    </Button>
                ) : null}
                {getCanNextPage() && (
                    <>
                        <Button
                            variant="outline"
                            disabled={!getCanNextPage()}
                            onClick={() => nextPage()}
                        >
                            <p>{pageIndex + 2}</p>
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
            <div className="flex items-center justify-center gap-1">
                {getCanPreviousPage() && (
                    <>
                        <p>Page: </p>
                        <Input
                            type="number"
                            min={1}
                            className="w-[50px] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            value={pageInput}
                            onChange={handlePageInputChange}
                        />
                        <Button
                            variant="outline"
                            onClick={() => setPage(pageInput - 1)}
                        >
                            Go!
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Pagination;
