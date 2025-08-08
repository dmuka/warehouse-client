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
  id: string
  receiptNumber: string
  receiptDate: string | Date
  items: ReceiptItem[]
}