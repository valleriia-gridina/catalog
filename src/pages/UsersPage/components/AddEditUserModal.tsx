import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import {
  useCreateUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "services/usersApi";
import { TCompanyOption, TUser } from "types/types";
import CompanySelect from "./CompanySelect";
import { useGetCompaniesQuery } from "services/companiesApi";
import LocationInput from "components/LocationInput/LocationInput";

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

const AddEditUserModal = ({ isOpen, onCloseModal, user }: TProps) => {
  const [formData, setFormData] = useState(initialValues);
  const [selectedCompany, setSelectedCompany] = useState<TCompanyOption>(null);

  const { data: users } = useGetUsersQuery();

  const [updateUser] = useUpdateUserMutation();
  const [createUser] = useCreateUserMutation();

  console.log(users);

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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      <DialogTitle>{user ? "Edit" : "Add new"} user</DialogTitle>
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
            companyValue={selectedCompany && user ? selectedCompany : null}
            companyOptions={companyOptions}
            onCompanySelectChange={(newValue) => {
              setSelectedCompany(newValue);
              setFormData((prev) => ({
                ...prev,
                companyName: newValue?.label || "DA",
              }));
            }}
          />
          {!user && (
            <TextField
              label="Email"
              name="email"
              onChange={handleChange}
              fullWidth
              required
            />
          )}
          {!user && (
            <LocationInput
              onSelect={(address, coords) => {
                console.log("Address:", address);
                console.log("Coords:", coords);
                setFormData({ ...formData, address });
              }}
            />
          )}
          <Button onClick={onCloseModal}>cancel</Button>
          <Button type="submit" variant="contained">
            save
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditUserModal;
