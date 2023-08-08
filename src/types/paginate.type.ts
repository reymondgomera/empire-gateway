export type PaginatedResource = {
    data: any[],
    meta: PaginationMetaType
}

export type PaginationMetaType = {
    total: number,
    lastPage: number,
    currentPage: number,
    perPage: number,
    prev?: number,
    next?: number
}

export type PaginateQuery = {
    perPage ?: string,
    page ?: string,
    includes ?: string,
    sort ?: string,
    filter ?: string
}