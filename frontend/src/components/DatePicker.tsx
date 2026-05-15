import React, { useCallback, useState } from "react";
import { format, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  newsDate: string;
  onSelect: (date: string | undefined) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  newsDate,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);

  const parsed = parseISO(newsDate);
  const formattedDisplay = new Date(newsDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  const handleSelect = useCallback((date: Date | undefined) => {
    setOpen(false);
    if (!date) {
      onSelect(undefined);
      return;
    }
    onSelect(format(date, "MM-dd-yyyy"));
  }, [onSelect]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button className="cursor-pointer uppercase hover:underline">
            {formattedDisplay}
          </button>
        }
      />
      <PopoverContent className="w-auto border-ink bg-paper p-0" align="center">
        <Calendar
          mode="single"
          selected={parsed}
          onSelect={handleSelect}
          disabled={(d) => d > new Date()}
        />
      </PopoverContent>
    </Popover>
  );
};
