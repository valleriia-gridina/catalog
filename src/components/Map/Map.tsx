import { GoogleMap, Marker } from "@react-google-maps/api";
import { useRef, useCallback } from "react";
import { LatLng } from "types/types";

type MapProps = {
  userLocation: LatLng | null;
  companyLocation: LatLng | null;
  height?: string;
  width?: string;
};

const Map: React.FC<MapProps> = ({
  userLocation,
  companyLocation,
  height = "400px",
  width = "100%",
}) => {
  const containerStyle = { height, width };
  const mapRef = useRef<google.maps.Map | null>(null);

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      if (!userLocation || !companyLocation) return;

      mapRef.current = map;
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(userLocation);
      bounds.extend(companyLocation);
      map.fitBounds(bounds);
    },
    [userLocation, companyLocation]
  );

  if (!userLocation || !companyLocation) {
    return <div>Invalid location data</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      onLoad={onLoad}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        fullscreenControl: false,
      }}
    >
      <Marker
        position={userLocation}
        icon={{
          url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
          scaledSize: new google.maps.Size(40, 40),
        }}
        label="user"
      />
      <Marker
        position={companyLocation}
        icon={{
          url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
          scaledSize: new google.maps.Size(40, 40),
        }}
        label="company"
      />
    </GoogleMap>
  );
};

export default Map;
