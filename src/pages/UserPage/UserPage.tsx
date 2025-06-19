import { useParams } from "react-router-dom";
import { useGetUserQuery, useUpdateUserMutation } from "services/usersApi";
import PageTitle from "components/PageTitle/PageTitle";
import Panel from "components/Panel/Panel";
import Map from "components/Map/Map";
import { LoadScript } from "@react-google-maps/api";
import LocationInput from "components/LocationInput/LocationInput";

import styles from "./UserPage.module.scss";
import { Box, Button, TextField, CircularProgress, Alert } from "@mui/material";
import { useState, useEffect } from "react";
import { useGetCompaniesQuery } from "services/companiesApi";
import { useGeocodeAddress } from "hooks/useGeocodeAddress";

const libraries: ("places" | "geometry")[] = ["places", "geometry"];

const UserPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading } = useGetUserQuery(id!, { skip: !id });
  const [updateUser] = useUpdateUserMutation();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [address, setAddress] = useState("");
  const [updateError, setUpdateError] = useState<string | null>(null);

  const { data: companiesList } = useGetCompaniesQuery();

  const userCompany = companiesList?.find(
    (company) => company.name.toLowerCase() === user?.companyName.toLowerCase()
  );

  // Инициализация адреса при загрузке пользователя
  useEffect(() => {
    if (user) {
      setAddress(user.address);
    }
  }, [user]);

  const {
    location: userLocation,
    loading: userLoading,
    error: userError,
  } = useGeocodeAddress(user?.address);
  const {
    location: companyLocation,
    loading: companyLoading,
    error: companyError,
  } = useGeocodeAddress(userCompany?.address);
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <div>User not found</div>;
  }

  const handleEdit = () => {
    setIsEdit(true);
    setAddress(user.address);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !address) return;

    try {
      setUpdateError(null);
      await updateUser({
        id,
        data: {
          ...user,
          address,
        },
      }).unwrap();
      setIsEdit(false);
    } catch (error) {
      setUpdateError("Failed to update user. Please try again.");
      console.error("Failed to update user:", error);
    }
  };

  const handleChange = () => {};

  const onCancel = () => {
    setIsEdit(false);
    setAddress(user.address);
    setUpdateError(null);
  };

  const isLoadingLocations = userLoading || companyLoading;

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY!}
      libraries={libraries}
    >
      <PageTitle
        title={`${user.firstName} user profile`}
        btnText={isEdit ? null : "Edit"}
        onBtnClick={handleEdit}
      />
      <Panel>
        {updateError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {updateError}
          </Alert>
        )}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            marginTop: 1,
          }}
          style={{ width: "100%" }}
        >
          <div className={styles.infoRow}>
            <label htmlFor="firstName" className={styles.label}>
              First name:
            </label>
            {isEdit ? (
              <TextField
                name="firstName"
                value={user.firstName}
                onChange={handleChange}
                fullWidth
                required
              />
            ) : (
              user.firstName
            )}
          </div>
          <div className={styles.infoRow}>
            <label htmlFor="lastName" className={styles.label}>
              Last name:
            </label>
            {isEdit ? (
              <TextField
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
                fullWidth
                required
              />
            ) : (
              user.lastName
            )}
          </div>
          <div className={styles.infoRow}>
            <label htmlFor="location" className={styles.label}>
              Location:
            </label>
            {isEdit ? (
              <LocationInput
                onSelect={(newAddress) => {
                  setAddress(newAddress);
                }}
              />
            ) : isLoadingLocations ? (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress size={24} />
              </Box>
            ) : userLocation && companyLocation ? (
              <Box sx={{ height: 400, width: "100%" }}>
                <Map
                  userLocation={userLocation}
                  companyLocation={companyLocation}
                />
              </Box>
            ) : (
              <div>Location data unavailable</div>
            )}
          </div>
          {isEdit && (
            <>
              <Button onClick={onCancel}>Cancel</Button>
              <Button type="submit" variant="contained">
                Save changes
              </Button>
            </>
          )}
        </Box>
      </Panel>
    </LoadScript>
  );
};

export default UserPage;
