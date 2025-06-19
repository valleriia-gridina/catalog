import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useDeleteUserMutation } from "services/usersApi";

type TProps = {
  isOpen: boolean;
  onCloseModal: () => void;
  selectedUserId?: string;
};

const DeleteUserModal = ({ isOpen, onCloseModal, selectedUserId }: TProps) => {
  const [deleteUser] = useDeleteUserMutation();

  return (
    <Dialog open={isOpen} onClose={onCloseModal}>
      <DialogTitle>Are you sure you want to delete user?</DialogTitle>

      <DialogContent>
        {selectedUserId && (
          <Button
            onClick={() => {
              deleteUser(selectedUserId);
              onCloseModal();
            }}
          >
            Yes
          </Button>
        )}
        <Button onClick={onCloseModal} variant="contained">
          No
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserModal;
