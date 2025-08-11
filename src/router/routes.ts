// Stock routes
export const STOCK = '/stock'

// Balances routes
export const BALANCES = `${STOCK}/balances`

// Receipts routes
export const RECEIPTS = `${STOCK}/receipts`
export const RECEIPT_ADD = `${RECEIPTS}/add`
export const RECEIPT_EDIT = `${RECEIPTS}/edit/:id`

// Shipments routes
export const SHIPMENTS = `${STOCK}/shipments`
export const SHIPMENT_ADD = `${SHIPMENTS}/add`
export const SHIPMENT_EDIT = `${SHIPMENTS}/edit/:id`

// References routes
export const REFERENCES = '/references'

// Resources routes
export const RESOURCES = `${REFERENCES}/resources`
export const RESOURCE_ADD = `${RESOURCES}/add`
export const RESOURCE_EDIT = `${RESOURCES}/edit/:id`

// Units routes
export const UNITS = `${REFERENCES}/units`
export const UNIT_ADD = `${UNITS}/add`
export const UNIT_EDIT = `${UNITS}/edit/:id`

// Clients routes
export const CLIENTS = `${REFERENCES}/clients`
export const CLIENT_ADD = `${CLIENTS}/add`
export const CLIENT_EDIT = `${CLIENTS}/edit/:id`



export const ROOT = BALANCES

