import { StringDictionary } from "@/app/types";
import { isValid } from "date-fns";
import { PaginationConstants } from "../constants/pagination";

export interface ValidSort {
    key: string;
    type: "string" | "number" | "date" | "enum";
}

export interface PaginationProps<TWhere> {
    page: number;
    pageSize: number;
    sort: string;
    order: string;
    advancedFilters?: TWhere;
    where?: TWhere;
    skip?: number;
    take?: number;
    orderBy?: StringDictionary;
}

const validOrder = ["asc", "desc"];
/**
 * Extracts and validates pagination and filtering properties from a URL.
 *
 * @param {URL} url - The URL object containing search parameters.
 * @param {ValidSort[]} validSort - An array of valid sort parameters.
 * @param {ValidSort[]} advancedFilterKeys - An array of valid advanced filter keys.
 * @returns {PaginationProps<TWhere>} An object containing pagination, sorting, and filtering properties.
 * @throws {Error} If the sort or order parameters are invalid.
 */
export function getApiPagination<TWhere>(
    url: URL,
    validSort: ValidSort[],
    advancedFilterKeys: ValidSort[],
): PaginationProps<TWhere> {
    const page = parseInt(
        url.searchParams.get("page") ||
            PaginationConstants.DEFAULT_PAGE.toString(),
    );
    let pageSize = parseInt(
        url.searchParams.get("pageSize") ||
            PaginationConstants.DEFAULT_PAGE_SIZE.toString(),
    );
    if (pageSize > PaginationConstants.MAX_PAGE_SIZE) {
        pageSize = PaginationConstants.MAX_PAGE_SIZE;
    } else if (pageSize < PaginationConstants.MIN_PAGE_SIZE) {
        pageSize = PaginationConstants.MIN_PAGE_SIZE;
    }
    const sortBy = url.searchParams.get("sortBy") || "";
    let sort = "";
    let order = "";
    if (sortBy && sortBy.match(/^[a-zA-Z0-9_]+\.(asc|desc)$/)) {
        [sort, order] = sortBy.split(".");
        if (sort) url.searchParams.set("sort", sort);
        if (order) url.searchParams.set("order", order);
    }

    const paginationProps: PaginationProps<TWhere> = {
        page,
        pageSize,
        sort,
        order,
    };

    const validSortKeys = validSort.map((sortParam) => sortParam.key);

    if (sort && !validSortKeys.includes(sort)) sort = "";
    if (order && !validOrder.includes(order)) order = "";

    const urlParams: StringDictionary = {};
    for (const key of advancedFilterKeys) {
        urlParams[key.key] = url.searchParams.get(key.key) || "";
    }

    const andFilters = [];
    for (const key of advancedFilterKeys) {
        if (urlParams[key.key]) {
            if (key.type === "string") {
                andFilters.push({
                    [key.key]: { contains: urlParams[key.key] },
                });
            } else if (key.type === "number") {
                andFilters.push({
                    [key.key]: parseInt(urlParams[key.key]),
                });
            } else if (key.type === "enum") {
                andFilters.push({
                    [key.key]: { equals: urlParams[key.key] },
                });
            } else if (key.type === "date") {
                if (isValid(urlParams[key.key])) {
                    const date = new Date(urlParams[key.key]);
                    const startDate = new Date(
                        date.getFullYear(),
                        date.getMonth(),
                        date.getDate(),
                    );
                    const endDate = new Date(
                        date.getFullYear(),
                        date.getMonth(),
                        date.getDate() + 1,
                    );
                    andFilters.push({
                        [key.key]: {
                            gte: startDate,
                            lt: endDate,
                        },
                    });
                }
            }
        }
    }

    const where = (andFilters.length > 0 ? { AND: andFilters } : {}) as TWhere;

    const skip = (page - 1) * pageSize;
    const orderBy =
        sort !== ""
            ? {
                  [sort]: order,
              }
            : {};

    console.log(
        JSON.stringify(
            {
                ...paginationProps,
                where,
                skip,
                take: pageSize,
                orderBy,
            },
            null,
            4,
        ),
    );
    return {
        ...paginationProps,
        where,
        skip,
        take: pageSize,
        orderBy,
    };
}

/**
 * Retrieves and processes pagination and sorting parameters from the provided search parameters.
 *
 * @param searchParams - A promise that resolves to an object containing search parameters.
 * @param advSearchParamsKeys - An array of keys that should be included in the advanced search parameters.
 * @returns An object containing the following properties:
 * - `page`: The current page number (default is 1).
 * - `sort`: The sorting parameter (default is an empty string).
 * - `order`: The order parameter (default is an empty string).
 * - `filter`: An object containing the filtered advanced search parameters.
 * - `advancedSearchParams`: An object containing the advanced search parameters.
 */
export async function getPagePagination(
    searchParams: Promise<{
        [key: string]: string | string[] | undefined;
    }>,
) {
    const srchParams = await searchParams;
    const page = parseInt(srchParams.page as string) || 1;
    const pageSize = parseInt(srchParams.pageSize as string) || 10;

    return {
        page,
        pageSize,
    };
}
