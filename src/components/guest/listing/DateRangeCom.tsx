import { CalenderDateRange } from "@/components/ui/CalenderDateRange";
import { DateRange } from "react-day-picker";

function DateRangeCom() {
  function handleDateChange(range: DateRange | undefined) {
    //    if (range?.from) dispatch(setStartDate(range.from.toISOString()));
    //    if (range?.to) dispatch(setEndDate(range.to.toISOString()));
    // update your state with new date range here.
  }

  return (
    <>
      <CalenderDateRange onChange={handleDateChange} />
    </>
  );
}

export default DateRangeCom;
