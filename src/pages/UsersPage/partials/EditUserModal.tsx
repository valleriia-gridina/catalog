import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import {
  useCreateUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "services/usersApi";

import CompanySelect from "./CompanySelect";

import { useGetCompaniesQuery } from "services/companiesApi";
import { TCompanyOption, TUser } from "types/types";

type TProps = {
  isOpen: boolean;
  onCloseModal: () => void;
  user?: TUser;
};

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  address: "",
  phone: "",
  companyName: "",
};

const EditUserModal = ({ isOpen, onCloseModal, user }: TProps) => {
  const [formData, setFormData] = useState(initialValues);
  const [selectedCompany, setSelectedCompany] = useState<TCompanyOption>(null);
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    companyName?: string;
  }>({});

  const { data: users } = useGetUsersQuery();

  const [updateUser] = useUpdateUserMutation();
  const [createUser] = useCreateUserMutation();

  const { data: companiesList } = useGetCompaniesQuery(undefined, {
    skip: !isOpen,
  });

  const companyOptions = companiesList?.map((company) => ({
    label: company.name,
    id: company.id,
  }));

  useEffect(() => {
    if (!user) return;

    const { firstName, lastName, email, address, phone, companyName } = user;

    setFormData({
      firstName,
      lastName,
      email,
      address,
      phone,
      companyName,
    });
    setSelectedCompany({
      label: user.companyName,
      id: user.companyName,
    });
  }, [user]);

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialValues);
      setSelectedCompany(null);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear the error message for the changed field
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: { email?: string; companyName?: string } = {};

    // email validation only when creating a new user
    if (!user) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!formData.email.trim()) {
        errors.email = "Email is required";
      } else if (!emailRegex.test(formData.email)) {
        errors.email = "Invalid email format";
      } else if (
        users?.some(
          (u) => u.email.toLowerCase() === formData.email.toLowerCase()
        )
      ) {
        errors.email = "This email already exists";
      }

      if (!formData.companyName.trim()) {
        errors.companyName = "Company is required";
      }
    }

    setFormErrors(errors);

    // if there are any validation errors, do not submit the form
    if (Object.keys(errors).length > 0) return;

    const updatedUser = {
      ...user,
      ...formData,
    };

    if (user) {
      updateUser({ id: user.id, data: updatedUser as TUser });
    } else {
      createUser(formData as TUser);
    }
    onCloseModal();
  };

  return (
    <Dialog open={isOpen} onClose={onCloseModal}>
      <DialogTitle>Edit user</DialogTitle>
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
            label="First name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Last name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            required
          />
          <CompanySelect
            companyValue={selectedCompany}
            companyOptions={companyOptions}
            onCompanySelectChange={(newValue) => {
              setFormErrors((prevErrors) => ({
                ...prevErrors,
                companyName: undefined,
              }));
              setSelectedCompany(newValue);
              setFormData((prev) => ({
                ...prev,
                companyName: newValue?.label || "DA",
              }));
            }}
            error={!!formErrors.companyName}
            helperText={formErrors.companyName}
          />
          <Button onClick={onCloseModal}>Cancel</Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
