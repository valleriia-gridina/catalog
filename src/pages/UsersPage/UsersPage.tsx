import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";

import Button from "components/Button/Button";
import PageTitle from "components/PageTitle/PageTitle";

import EditUserModal from "./partials/EditUserModal";
import DeleteUserModal from "./partials/DeleteUserModal";

import { useGetUsersQuery } from "services/usersApi";
import { TUser } from "types/types";
import { DEFAULT_USERS_PER_PAGE } from "constants/constants";

// import styles from "./UsersPage.module.scss";

const UsersPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_USERS_PER_PAGE);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TUser | undefined>(
    undefined
  );

  const { data: users, error, isLoading } = useGetUsersQuery();

  const visibleUsers = useMemo(() => {
    if (rowsPerPage > 0) {
      const start = page * rowsPerPage;
      const end = start + rowsPerPage;
      return users?.slice(start, end);
    }
    return users;
  }, [users, page, rowsPerPage]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;
  if (!users) return <p>No users</p>;

  const handleOpenEditModal = (user?: TUser) => {
    setIsAddEditModalOpen(true);
    if (user) {
      setSelectedUser(user);
    } else {
      setSelectedUser(undefined);
    }
  };

  const handleCloseAddEditModal = () => {
    setIsAddEditModalOpen(false);
  };

  const handleAddUser = () => {
    console.log("add new user");
  };

  const handleOpenDeleteModal = (user?: TUser) => {
    setIsDeleteModalOpen(true);
    setSelectedUser(user);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedUser(undefined);
  };

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null, //???
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <PageTitle
        title={"All users"}
        btnText={"Add new user"}
        onBtnClick={handleAddUser}
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Company name</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length ? (
              (rowsPerPage > 0 ? visibleUsers! : users).map(
                (user: TUser, index) => {
                  const userName = `${user.firstName} ${user.lastName}`;

                  return (
                    <TableRow key={user.id}>
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <Link to={`/users/${user.id}`}>
                          <strong>{userName}</strong>
                        </Link>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell width={200}>{user.address}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.companyName}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => {
                            handleOpenEditModal(user);
                          }}
                        >
                          edit
                        </Button>
                        {" / "}
                        <Button
                          onClick={() => {
                            handleOpenDeleteModal(user);
                          }}
                        >
                          delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                }
              )
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <p>No users here</p>
                  <Button
                    onClick={() => {
                      handleAddUser();
                    }}
                  >
                    Add a new user
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {users.length > DEFAULT_USERS_PER_PAGE && (
        <TablePagination
          component="div"
          rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
          colSpan={3}
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          slotProps={{
            select: {
              native: true,
            },
          }}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
      <EditUserModal
        isOpen={isAddEditModalOpen}
        onCloseModal={handleCloseAddEditModal}
        user={selectedUser}
      />
      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onCloseModal={handleCloseDeleteModal}
        selectedUserId={selectedUser?.id}
      />
    </>
  );
};

export default UsersPage;
