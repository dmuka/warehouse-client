export interface ShipmentItem {
  id: string
  shipmentId?: string
  resourceId: string
  resourceName: string
  unitId: string
  unitName: string
  quantity: number
}

export interface Shipment {
  id?: string
  shipmentNumber: string
  clientId: string
  clientName: string
  shipmentDate: string | Date
  status: 'Draft' | 'Signed';
  items: ShipmentItem[]
}

export interface ShipmentFilter {
  dateFrom?: Date
  dateTo?: Date
  shipmentNumber?: string
  clientIds?: string[]
  resourceIds?: string[]
  unitIds?: string[]
  page: number
  size: number
}