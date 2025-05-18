
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  id?: string
  name?: string
  defaultDate?: Date
  onSelect?: (date: Date | undefined) => void
  required?: boolean
  className?: string
}

export function DatePicker({
  id,
  name,
  defaultDate,
  onSelect,
  required,
  className,
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(defaultDate)

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (onSelect) {
      onSelect(selectedDate)
    }
  }

  return (
    <div className="relative">
      {/* We add a hidden input field with the required attribute when needed */}
      {required && (
        <input
          type="hidden"
          id={`${id}-hidden`}
          name={name}
          required={required}
          value={date ? format(date, "yyyy-MM-dd") : ""}
        />
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            name={name} 
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              className
            )}
            // We removed the required prop as it's not accepted by Button
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "dd/MM/yyyy") : <span>Selecione uma data</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
