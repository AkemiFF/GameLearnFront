"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const continents = [
  { value: "all", label: "Tous les continents" },
  { value: "Europe", label: "Europe" },
  { value: "Asia", label: "Asie" },
  { value: "Africa", label: "Afrique" },
  { value: "North America", label: "Amérique du Nord" },
  { value: "South America", label: "Amérique du Sud" },
  { value: "Oceania", label: "Océanie" },
]

interface ContinentFilterProps {
  onFilterChange: (continent: string) => void
}

export function ContinentFilter({ onFilterChange }: ContinentFilterProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("all")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {value === "all" ? "Tous les continents" : continents.find((continent) => continent.value === value)?.label}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Rechercher un continent..." />
          <CommandList>
            <CommandEmpty>Aucun continent trouvé.</CommandEmpty>
            <CommandGroup>
              {continents.map((continent) => (
                <CommandItem
                  key={continent.value}
                  value={continent.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue)
                    onFilterChange(currentValue)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === continent.value ? "opacity-100" : "opacity-0")} />
                  {continent.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

