import Select, { SelectProps } from "react-dropdown-select";

import "./styles.scss";

const DropdownSelect = <T extends string | object>(props: SelectProps<T>) => (
  <Select searchable color="#e72313" className="lexo-dropdown" {...props} />
);

export default DropdownSelect;
