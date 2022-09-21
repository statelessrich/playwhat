import React, { useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import AddGameForm from "components/add-game-form/AddGameForm";

// bind modal to app element
const Modal = withReactContent(Swal);

export default function AddGameModal({ isOpen, closeModal, submitGame }) {
  useEffect(() => {
    if (isOpen) {
      Modal.fire({
        // confirmButtonText: "Submit",
        showConfirmButton: false,
        showCloseButton: true,
        title: <p>Add new game</p>,
        html: <AddGameForm closeModal={closeModal} submitGame={submitGame} />,
        didOpen: () => {
          // `MySwal` is a subclass of `Swal` with all the same instance & static methods
          // MySwal.showLoading();
        },
      }).then((result) => {
        // return MySwal.fire(<p>Shorthand works too</p>);
      });
    } else {
      Modal.close();
    }
  }, [closeModal, isOpen, submitGame]);

  return <></>;
}
