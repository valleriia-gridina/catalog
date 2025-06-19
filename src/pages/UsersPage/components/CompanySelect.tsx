import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { TCompanyOption } from "types/types";

type TProps = {
  companyValue?: TCompanyOption;
  companyOptions?: TCompanyOption[];
  onCompanySelectChange: (value: TCompanyOption) => void;
};

const CompanySelect = ({
  companyValue,
  companyOptions,
  onCompanySelectChange,
}: TProps) => {
  return (
    <Autocomplete
      disablePortal
      options={companyOptions || []}
      value={companyValue}
      onChange={(_, newValue) => {
        console.log(22, newValue, companyOptions);
        onCompanySelectChange(newValue);
      }}
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
      fullWidth
      renderInput={(params) => (
        <TextField {...params} label="Company" placeholder="Select company" />
      )}
    />
  );
};

export default CompanySelect;
