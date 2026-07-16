import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";

interface DateFilterComponentProps {
  onSelect: (date: Date) => void;
  mode?: "single" | "range" | "multiple";
  width?: string;
  needCurrent?: boolean;
  disabled?: boolean;
  selectedDate?: Date;
}

const DateFilterComponent = ({
  onSelect,
  mode = "single",
  width = "240px",
  needCurrent = false,
  disabled = false,
  selectedDate
}: DateFilterComponentProps) => {
  const [date, setDate] = React.useState<Date | DateRange | Date[] | undefined>(
    selectedDate ?? (needCurrent ? new Date() : undefined)
  );
  const [open, setOpen] = React.useState(false);


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          style={{ border: "1px solid #ccc", width }}
          className={cn("justify-start text-left font-normal", !date && "text-gray-500")}
        >
          <CalendarIcon />
          {date ? format(date as Date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      {!disabled && (
        <PopoverContent className="w-auto p-0" align="start" style={{ zIndex: 9999 }}>
          <Calendar
            mode={mode as "single"}
            selected={date as Date}
            onSelect={(selectedDate: Date | DateRange | undefined) => {
              setDate(selectedDate);
              onSelect(selectedDate as Date);
              setOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      )}
    </Popover>
  );
};

export default DateFilterComponent;

interface Props {
  date: string | null;
  setDate: (value: string) => void;
  label: string
}

export const MuiDatePicker: React.FC<Props> = ({ date, setDate, label }) => {
  const handleChange = (date: Date | null) => {
    if (date) {
      const formatted = moment(date).format('YYYY-MM-DD') // yyyy-mm-dd
      setDate(formatted);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={label}
        value={date && !isNaN(new Date(date).getTime()) ? new Date(date) : null}
        onChange={handleChange}
        slotProps={{
          textField: {
            fullWidth: true,
            size: "small",
            sx: {
              "& label": {
                color: "#2c8786",
              },
              "& label.Mui-focused": {
                color: "#2c8786",
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};