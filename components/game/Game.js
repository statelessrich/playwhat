import Skeleton from "react-loading-skeleton";
import styles from "./game.module.scss";
import { useNavigate } from "react-router-dom";
import { Context } from "../../utils/Context";
import { useContext } from "react";
import { getGameDetails } from "../../utils/api";
import { formatPlatforms } from "../../utils/utils";

export default function Game({ data, isDetailPage, isLoading }) {
  const navigate = useNavigate();
  const { setGameDetails } = useContext(Context);

  async function onClick() {
    // do nothing if user added game
    if (data.isUserAdded) {
      return;
    }

    try {
      const response = await getGameDetails(data.id);
      setGameDetails(response.data);
      navigate("/game/" + response.data.id);
    } catch {
      // if error go to home
      navigate("/");
    }
  }

  return (
    <div
      className={`${styles.game} ${isDetailPage ? styles.gameDetails : ""} ${
        isLoading ? styles.isLoading : ""
      }`}
      onClick={onClick}
    >
      {data ? (
        <>
          {/* background image */}
          <img src={data.background_image} alt={data.name} />

          <h2>
            {/* name */}
            {data.name}
            <br />

            {/* list of platforms */}
            <small>{formatPlatforms(data.platforms)}</small>
          </h2>
        </>
      ) : (
        <Skeleton className={styles.skeleton} count={10} />
      )}
    </div>
  );
}
