import AddGameForm from "components/add-game-form/AddGameForm";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// bind modal to app element
const AddGameModal = withReactContent(Swal);

export function openAddGameModal(submitGame) {
  AddGameModal.fire({
    showConfirmButton: false,
    showCloseButton: true,
    title: <p>Add new game</p>,
    html: <AddGameForm closeModal={closeAddGameModal} submitGame={submitGame} />,
  }).then(() => {
    // clicked outside modal
    closeAddGameModal();
  });
}

export function closeAddGameModal() {
  AddGameModal.close();
}

// return list separated by separator (default: |)
export function formatPlatforms(list, separator = "|") {
  return list?.map(
    (platform, index) => `${platform.platform.name}${index < list.length - 1 ? separator : ""}`,
  );
}

// return list separated by separator (default: |)
export function formatGenres(list, separator = "|") {
  return list?.map(
    (genre, index) => `${genre.name}${index < list.length - 1 ? separator : ""}`,
  );
}
