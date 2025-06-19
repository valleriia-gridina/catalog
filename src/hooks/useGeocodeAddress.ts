import { useEffect, useState } from "react";
import { LatLng } from "types/types";

export const useGeocodeAddress = (address?: string) => {
  const [location, setLocation] = useState<LatLng | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setLocation(null);
      setError(null);
      return;
    }

    const geocode = () => {
      setLoading(true);
      setError(null);

      // Check if Google Maps API is loaded
      if (
        typeof google === "undefined" ||
        !google.maps ||
        !google.maps.Geocoder
      ) {
        setError("Google Maps API not loaded");
        setLoading(false);
        return;
      }

      try {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
          if (
            status === "OK" &&
            results &&
            results.length > 0 &&
            results[0].geometry?.location
          ) {
            const loc = results[0].geometry.location;
            setLocation({ lat: loc.lat(), lng: loc.lng() });
          } else {
            setError(`Geocoding failed: ${status}`);
            setLocation(null);
          }
          setLoading(false);
        });
      } catch (err) {
        setError("Geocoding error occurred");
        setLocation(null);
        setLoading(false);
      }
    };

    // Wait for Google Maps API to be fully loaded
    const checkAndGeocode = () => {
      if (
        typeof google !== "undefined" &&
        google.maps &&
        google.maps.Geocoder
      ) {
        geocode();
      } else {
        // Retry after a short delay
        setTimeout(checkAndGeocode, 100);
      }
    };

    checkAndGeocode();
  }, [address]);

  return { location, loading, error };
};
