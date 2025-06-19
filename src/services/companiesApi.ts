import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "constants/constants";
import { TCompany } from "types/types";

export const companiesApi = createApi({
  reducerPath: "companiesApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Companies"],
  endpoints: (builder) => ({
    getCompanies: builder.query<TCompany[], void>({
      query: () => ({ url: "companies", method: "GET" }),
      providesTags: ["Companies"],
    }),
    createCompany: builder.mutation<TCompany, TCompany>({
      query: (data) => ({
        url: "companies",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Companies"],
    }),
  }),
});

export const { useGetCompaniesQuery, useCreateCompanyMutation } = companiesApi;
