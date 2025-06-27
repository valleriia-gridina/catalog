import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { TCompanyOption } from "types/types";

type TProps = {
  companyValue?: TCompanyOption;
  companyOptions?: TCompanyOption[];
  onCompanySelectChange: (value: TCompanyOption) => void;
  error: boolean;
  helperText?: string;
};

const CompanySelect = ({
  companyValue,
  companyOptions,
  onCompanySelectChange,
  error,
  helperText,
}: TProps) => {
  return (
    <Autocomplete
      disablePortal
      options={companyOptions || []}
      value={companyValue}
      onChange={(_, newValue) => {
        onCompanySelectChange(newValue);
      }}
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
      fullWidth
      renderInput={(params) => (
        <TextField
          {...params}
          label="Company"
          placeholder="Select company"
          error={error}
          helperText={helperText}
        />
      )}
    />
  );
};

export default CompanySelect;
