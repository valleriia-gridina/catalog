import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "constants/constants";
import { TUser } from "types/types";

// Теперь у тебя есть рабочий REST API:
// Метод	URL	Описание
// GET	http://localhost:3001/users	Получить всех пользователей
// POST	http://localhost:3001/users	Добавить нового
// PUT	http://localhost:3001/users/1	Полностью обновить пользователя
// PATCH	http://localhost:3001/users/1	Частично обновить
// DELETE	http://localhost:3001/users/1	Удалить пользователя

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query<TUser[], void>({
      query: () => ({
        url: "users",
        method: "GET",
      }),
      providesTags: ["Users"],
    }),
    getUser: builder.query<TUser, string>({
      query: (id) => ({
        url: `users/${id}`,
        method: "GET",
      }),
      providesTags: ["Users"],
    }),
    updateUser: builder.mutation<TUser, { id: string; data: TUser }>({
      query: ({ id, data }) => ({
        url: `users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
    createUser: builder.mutation<TUser, TUser>({
      query: (data) => {
        console.log({ data });
        return {
          url: `users`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation<TUser, string>({
      query: (id) => ({
        url: `users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useCreateUserMutation,
  useDeleteUserMutation,
} = usersApi;
