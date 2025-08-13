export interface Balance {
  id: string
  resourceId: string
  resourceName: string
  unitId: string
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