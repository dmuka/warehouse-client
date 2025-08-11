export interface ReceiptItem {
  id: string
  receiptId?: string
  resourceId: string
  resourceName: string
  unitId: string
  unitName: string
  quantity: number
}

export interface Receipt {
  id?: string
  receiptNumber: string
  receiptDate: string | Date
  items: ReceiptItem[]
}

export interface ReceiptFilter {
  dateFrom?: Date
  dateTo?: Date
  receiptNumber?: string
  resourceIds?: string[]
  unitIds?: string[]
  page: number
  size: number
}