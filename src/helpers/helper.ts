export const geocodeCity = async (
  city: string
): Promise<{ lat: number; lng: number } | null> => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      city
    )}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
  );
  const data = await response.json();

  if (data.status === "OK") {
    const { lat, lng } = data.results[0].geometry.location;
    return { lat, lng };
  }

  return null;
};
