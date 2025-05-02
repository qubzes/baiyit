export interface AcquisitionItem {
  id: string
  title: string
  price: number
  quantity: number
  image: string
}

export interface Acquisition {
  id: string
  date: string
  total: number
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled"
  items: AcquisitionItem[]
}
