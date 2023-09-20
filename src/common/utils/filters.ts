// Conditional Operators for Prisma Conversion
export function convertOperator(operator) {
  switch (operator) {
    case 'startswith':
      return 'startsWith'
    case 'endswith':
      return 'endsWith'
    case 'notcontains':
      return `not`
    case '=':
      return 'equals'
    case 'in':
      return 'in'
    case '<>':
      return 'not'
    case '>=':
      return 'gte'
    case '<=':
      return 'lte'
    case '<':
      return 'lt'
    case '>':
      return 'gt'

    default:
      return operator
  }
}

// Filter logic build where clause for each AND & OR handling multiple where function.
export function buildWhereClause(filter: any[]): any {
  if (typeof filter[0] === 'string') {
    return {
      [filter[0]]: {
        [convertOperator(filter[1])]: filter[2]
      }
    }
  }

  const left = buildWhereClause(filter[0])
  const right = buildWhereClause(filter[2])

  switch (filter[1]) {
    case 'and':
      return { AND: [left, right] }
    case 'or':
      return { OR: [left, right] }
    default:
      throw new Error('Invalid filter operator')
  }
}
