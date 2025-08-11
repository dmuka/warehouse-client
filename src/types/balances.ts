export interface Balance {
  id: string
  resourceName: string
  unitName: string
  quantity: number
}

export interface BalanceFilter {
  resourceNames?: string[]
  unitNames?: string[]
}

export interface BalanceByResourceAndUnit {
  resourceId: string
  unitId: string
}