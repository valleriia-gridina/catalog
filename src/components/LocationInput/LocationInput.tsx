import { useRef } from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import TextField from "@mui/material/TextField";

import styles from "./LocationInput.module.scss";

const libraries: "places"[] = ["places"];

const LocationInput = ({
  onSelect,
}: {
  onSelect: (address: string, location: google.maps.LatLngLiteral) => void;
}) => {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();

    if (!place || !place.geometry || !place.geometry.location) return;

    const address = place.formatted_address || "";
    const location = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };

    onSelect(address, location);
  };

  if (!isLoaded) return <div>Loading Google Maps...</div>;

  return (
    <Autocomplete
      onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
      onPlaceChanged={handlePlaceChanged}
    >
      <TextField
        fullWidth
        label="Enter address"
        slotProps={{
          input: {
            className: styles.locationInput,
          },
        }}
      />
    </Autocomplete>
  );
};

export default LocationInput;
