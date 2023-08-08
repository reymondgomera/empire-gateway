export type Entity = {
    id: string
    code: string
    name: string
    isShow: boolean
    isDefault: boolean
    isParent: boolean
    parentId?: string
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
}

export type Reference = {
    id: string
    code: string
    name: string
    isShow: boolean
    isDefault: boolean
    entityId: String
    parentId?: string
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
}