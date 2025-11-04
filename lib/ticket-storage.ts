// Utility functions for managing tickets in localStorage

export interface PassengerInfo {
  ticketType: string
  name: string
  email: string
  phone: string
  id?: string
  needsAccessibility: string
  pickupLocations: Record<string, string> // routeId -> stationId
  ticketSerial?: string
}

export interface StoredTicket {
  id: string
  name: string
  routeName: string
  date: string
  quantity: number
  totalAmount: number
  status: "purchased" | "reserved" | "cancelled" | "completed"
  seatAssigned: boolean
  seatNumber?: string
  purchaseDate: string
  validUntil: string
  type: string
  breakdown: Record<string, { label: string; count: number; price: number; subtotal: number }>
  selectedDates: Array<{ routeId: string; routeName: string; date: string; cancelled?: boolean }>
  passengers?: PassengerInfo[]
  contactName?: string
  contactEmail?: string
  contactPhone?: string
}

const TICKETS_STORAGE_KEY = "penghu_tickets"

export function saveTicket(orderData: any): StoredTicket {
  // Generate a unique ticket ID
  const ticketId = `TK${Date.now().toString().slice(-6)}`

  // Calculate valid until date (30 days from purchase)
  const purchaseDate = new Date()
  const validUntil = new Date(purchaseDate)
  validUntil.setDate(validUntil.getDate() + 30)

  // Get the first route name for display
  const firstRoute = orderData.selectedDates?.[0]?.routeName || "未知路線"
  const firstDate = orderData.selectedDates?.[0]?.date || "未知日期"

  const ticket: StoredTicket = {
    id: ticketId,
    name: orderData.ticketName,
    routeName: firstRoute,
    date: firstDate,
    quantity: orderData.passengerCount,
    totalAmount: orderData.totalAmount,
    status: "purchased",
    seatAssigned: false, // New purchases are not seat-assigned yet
    purchaseDate: purchaseDate.toLocaleDateString("zh-TW"),
    validUntil: validUntil.toLocaleDateString("zh-TW"),
    type: orderData.ticketType,
    breakdown: orderData.ticketBreakdown,
    selectedDates: orderData.selectedDates,
    passengers: orderData.passengers || [],
    contactName: orderData.passengers?.[0]?.name || "",
    contactEmail: orderData.passengers?.[0]?.email || "",
    contactPhone: orderData.passengers?.[0]?.phone || "",
  }

  // Get existing tickets
  const existingTickets = getTickets()

  // Add new ticket to the beginning of the array
  const updatedTickets = [ticket, ...existingTickets]

  // Save to localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(updatedTickets))
  }

  return ticket
}

export function getTickets(): StoredTicket[] {
  if (typeof window === "undefined") {
    return []
  }

  try {
    const ticketsJson = localStorage.getItem(TICKETS_STORAGE_KEY)
    if (!ticketsJson) {
      return []
    }
    return JSON.parse(ticketsJson)
  } catch (error) {
    console.error("Failed to parse tickets from localStorage:", error)
    return []
  }
}

export function getTicketById(id: string): StoredTicket | null {
  const tickets = getTickets()
  return tickets.find((ticket) => ticket.id === id) || null
}

export function updateTicket(id: string, updates: Partial<StoredTicket>): boolean {
  const tickets = getTickets()
  const ticketIndex = tickets.findIndex((ticket) => ticket.id === id)

  if (ticketIndex === -1) {
    return false
  }

  tickets[ticketIndex] = { ...tickets[ticketIndex], ...updates }

  if (typeof window !== "undefined") {
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets))
  }

  return true
}

export function deleteTicket(id: string): boolean {
  const tickets = getTickets()
  const filteredTickets = tickets.filter((ticket) => ticket.id !== id)

  if (filteredTickets.length === tickets.length) {
    return false // Ticket not found
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(filteredTickets))
  }

  return true
}
