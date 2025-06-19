export type TUser = {
  companyName: string;
  email: string;
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
};

export type TCompany = {
  id: string;
  name: string;
  address: string;
};

export type TCompanyOption = {
  label?: string;
  id?: string;
} | null;

export type LatLng = {
  lat: number;
  lng: number;
};
