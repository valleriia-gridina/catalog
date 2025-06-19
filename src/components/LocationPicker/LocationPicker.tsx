import { useCallback, useRef, useState } from "react";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  Autocomplete,
} from "@react-google-maps/api";
import TextField from "@mui/material/TextField";

const centerDefault = { lat: 50.4501, lng: 30.5234 }; // Киев (пример)

const libraries: "places"[] = ["places"];

type Props = {
  onSelectLocation: (data: {
    address: string;
    coords: { lat: number; lng: number };
  }) => void;
};

const LocationPicker = ({ onSelectLocation }: Props) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const [marker, setMarker] = useState(centerDefault);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (!place?.geometry?.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const address = place.formatted_address || "";

    const position = { lat, lng };
    setMarker(position);
    map?.panTo(position);
    onSelectLocation({ address, coords: position });
  };

  const handleMapClick = useCallback(
    async (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results) => {
        const address = results?.[0]?.formatted_address ?? "";
        setMarker({ lat, lng });
        onSelectLocation({ address, coords: { lat, lng } });
      });
    },
    [onSelectLocation]
  );

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <div>
      <Autocomplete
        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
        onPlaceChanged={handlePlaceChanged}
      >
        <TextField fullWidth label="Enter address" margin="normal" />
      </Autocomplete>

      <GoogleMap
        center={marker}
        zoom={12}
        mapContainerStyle={{ width: "100%", height: "400px" }}
        onClick={handleMapClick}
        onLoad={(mapInstance) => setMap(mapInstance)}
      >
        <Marker position={marker} />
      </GoogleMap>
    </div>
  );
};

export default LocationPicker;
