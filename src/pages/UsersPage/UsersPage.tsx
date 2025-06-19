import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { useState } from "react";
import Button from "components/Button/Button";
import AddEditUserModal from "./components/AddEditUserModal";
import { useGetUsersQuery } from "services/usersApi";
import { TUser } from "types/types";
import DeleteUserModal from "./components/DeleteUserModal";
import { Link } from "react-router-dom";
import { USERS_PER_PAGE } from "constants/constants";
import PageTitle from "components/PageTitle/PageTitle";

// import styles from "./UsersPage.module.scss";

const UsersPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(USERS_PER_PAGE);
  const [addEditModalIsOpen, setAddEditModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TUser | undefined>(
    undefined
  );

  const { data: users, error, isLoading } = useGetUsersQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;
  if (!users) return <p>No users</p>;

  const handleOpenAddEditModal = (user?: TUser) => {
    setAddEditModalIsOpen(true);
    if (user) {
      setSelectedUser(user);
    } else {
      setSelectedUser(undefined);
    }
  };

  const handleOpenDeleteModal = (user?: TUser) => {
    setDeleteModalIsOpen(true);
    setSelectedUser(user);
  };

  const handleCloseAddEditModal = () => {
    setAddEditModalIsOpen(false);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalIsOpen(false);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
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

  console.log(users);

  return (
    <>
      <PageTitle
        title={"All users"}
        btnText={"Add new user"}
        onBtnClick={() => handleOpenAddEditModal()}
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
            {(rowsPerPage > 0
              ? users.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : users
            ).map((user: TUser, index) => (
              <TableRow key={user.id}>
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <Link to={`/users/${user.id}`}>
                    <strong>{`${user.firstName} ${user.lastName}`}</strong>
                  </Link>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.companyName}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => {
                      handleOpenAddEditModal(user);
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
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {users.length > USERS_PER_PAGE && (
        <TablePagination
          component="div"
          rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
          colSpan={3}
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          slotProps={{
            select: {
              inputProps: {
                "aria-label": "rows per page",
              },
              native: true,
            },
          }}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
      <AddEditUserModal
        isOpen={addEditModalIsOpen}
        onCloseModal={handleCloseAddEditModal}
        user={selectedUser}
      />
      <DeleteUserModal
        isOpen={deleteModalIsOpen}
        onCloseModal={handleCloseDeleteModal}
        selectedUserId={selectedUser?.id}
      />
    </>
  );
};

export default UsersPage;
