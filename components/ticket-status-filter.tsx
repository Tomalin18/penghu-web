"use client"

interface TicketStatusFilterProps {
  selectedStatus: string
  onStatusChange: (status: string) => void
}

export function TicketStatusFilter({ selectedStatus, onStatusChange }: TicketStatusFilterProps) {
  const statusOptions = ["全部", "未劃位", "已劃位", "已搭乘", "已取消"]

  const handleClick = (status: string) => {
    onStatusChange(status)
  }

  return (
    <div className="sticky top-16 z-30 bg-background flex bg-muted rounded-lg p-1 mb-0 pointer-events-auto">
      {statusOptions.map((status) => (
        <button
          key={status}
          className={`flex-1 py-2 px-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            selectedStatus === status
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => handleClick(status)}
        >
          {status}
        </button>
      ))}
    </div>
  )
}

