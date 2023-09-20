import { createPaginator } from 'prisma-pagination'

export const paginateResource = async (model, query) => {
  return await createPaginator({ perPage: query.perPage ? query.perPage : 20 })(
    model,
    {
      where: getFilterQuery(query),
      orderBy: getSortQuery(query),
      include: getIncludeQuery(query)
    },
    { page: query.page }
  )
}

export const getFilterQuery = (query) => {
  const filterQuery = {}

  if (query.hasOwnProperty('filter')) {
    Object.keys(query.filter).forEach((key: string) => {
      const value = query.filter[key]
      filterQuery[key] = +value ? +value : value
    })
  }

  return filterQuery
}

export const getHeaderFilter = (query) => {
  const headerFilter = {}

  if (query.hasOwnProperty('headerFilter')) {
    Object.keys(query.headerFilter).forEach((key: string) => {
      const value = query.headerFilter[key]
      headerFilter[key] = +value ? +value : value
    })
  }

  return headerFilter
}

const getSortQuery = (query) => {
  const sortQuery: any = []
  if (query.hasOwnProperty('sort')) {
    if (Array.isArray(query.sort)) {
      query.sort.forEach((value: string) => {
        sortQuery.push({
          [value.replace('-', '')]: value.includes('-') ? 'desc' : 'asc'
        })
      })
    } else {
      sortQuery.push({
        [query.sort.replace('-', '')]: query.sort.includes('-') ? 'desc' : 'asc'
      })
    }
  }

  return sortQuery
}

const getIncludeQuery = (query) => {
  const includeQuery = {}

  if (query.hasOwnProperty('include')) {
    const setQueryValue = (queryIncludeArray) => {
      queryIncludeArray.split(',').forEach((value: string) => {
        includeQuery[value.trim()] = true
      })
    }

    const queryInclude = query.include

    if (Array.isArray(query.include)) {
      query.include.forEach((value: string) => {
        setQueryValue(value)
      })
    } else {
      setQueryValue(queryInclude)
    }
  }

  return Object.keys(includeQuery).length ? includeQuery : null
}
