import { useField } from "formik";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

function MyDatePicker({ name = "" }) {
  const [field, meta, helpers] = useField(name);

  const { value } = meta;
  const { setValue } = helpers;

  return (
    <DatePicker
      {...field}
      selected={value}
      onChange={(date) => setValue(date)}
      timeInputLabel="Time:"
      dateFormat="MM/dd/yyyy h:mm aa"
      showTimeInput
    />
  );
};

export default MyDatePicker;