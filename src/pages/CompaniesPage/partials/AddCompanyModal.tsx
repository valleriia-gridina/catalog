import { useState } from "react";

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

import { useCreateCompanyMutation } from "services/companiesApi";
import { TCompany } from "types/types";

type TProps = {
  isOpen: boolean;
  onCloseModal: () => void;
};

const initialValues = {
  name: "",
  address: "",
};

const AddCompanyModal = ({ isOpen, onCloseModal }: TProps) => {
  const [formData, setFormData] = useState(initialValues);

  const [createCompamy] = useCreateCompanyMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCompamy(formData as TCompany);
    onCloseModal();
  };

  return (
    <Dialog open={isOpen} onClose={onCloseModal}>
      <DialogTitle>Create a new company</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: 400,
            marginTop: 1,
          }}
        >
          <TextField
            label="Company name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Company location"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            required
          />
          <Button onClick={onCloseModal}>Cancel</Button>
          <Button type="submit" variant="contained">
            Add company
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
export default AddCompanyModal;
