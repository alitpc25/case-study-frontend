import { useField } from "formik";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

function MyPhoneInput({ name = "" }) {
  const [field, meta, helpers] = useField(name);

  const { value } = meta;
  const { setValue } = helpers;

  return (
    <PhoneInput
        {...field}
        placeholder="Enter phone number"
        name={name}
        value={value}
        onChange={(phone) => setValue(phone)}
    />
  );
};

export default MyPhoneInput;