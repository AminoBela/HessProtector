import * as React from "react"
import { format } from "date-fns"
import { fr, es } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Translations } from "@/lib/i18n"

const localeMap: Record<string, any> = { fr, es }

interface PremiumDatePickerProps {
    date: Date | undefined
    setDate: (date: Date | undefined) => void
    placeholder?: string
    className?: string
    isLight?: boolean
    disabledDays?: (date: Date) => boolean
    language?: string
}

export function PremiumDatePicker({
    date,
    setDate,
    placeholder,
    className,
    isLight = false,
    disabledDays,
    language = "fr"
}: PremiumDatePickerProps) {

    const locale = localeMap[language] || fr
    const t = Translations[language as keyof typeof Translations] || Translations.fr
    const defaultPlaceholder = t.common.selectDate || (language === "es" ? "Seleccionar fecha" : "Sélectionner une date")

    const buttonStyle = isLight
        ? "bg-white border-emerald-900/10 text-slate-800 hover:bg-emerald-50 focus:ring-2 focus:ring-emerald-500/50 transition-[border-color,box-shadow,background-color] shadow-inner font-medium"
        : "bg-zinc-950/60 border-white/10 text-white hover:bg-zinc-900 focus:ring-2 focus:ring-emerald-500/50 transition-[border-color,box-shadow,background-color] shadow-inner font-medium";

    const popoverStyle = isLight
        ? "bg-white/95 backdrop-blur-xl border-emerald-900/10 shadow-2xl"
        : "bg-zinc-950/95 backdrop-blur-xl border-white/10 shadow-2xl text-white";

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full !h-14 justify-start text-left font-normal rounded-xl px-4",
                        buttonStyle,
                        !date && "text-muted-foreground",
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4 text-emerald-500" />
                    {date ? format(date, "PPP", { locale }) : <span>{placeholder || defaultPlaceholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className={cn("w-auto p-0 rounded-2xl overflow-hidden", popoverStyle)}>
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={disabledDays}
                    initialFocus
                    locale={locale}
                    captionLayout="dropdown"
                    fromYear={2020}
                    toYear={2035}
                    className="p-3 pointer-events-auto"
                />
            </PopoverContent>
        </Popover>
    )
}
