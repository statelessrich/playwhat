import Skeleton from "react-loading-skeleton";
import styles from "./game.module.scss";
import { useNavigate } from "react-router-dom";
import { Context } from "../../utils/Context";
import { useContext } from "react";
import Platforms from "../Platforms";
import { getGameDetails } from "../../utils/api";

export default function Game({ data, isDetailPage, isLoading }) {
  const navigate = useNavigate();
  const { setGameDetails } = useContext(Context);

  function onClick() {
    getGameDetails(data.id);

    setGameDetails(data);
    navigate("/game/" + data.slug);
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
          <img src={data.background_image} alt={data.name} />
          <h2>
            {data.name}
            <br />
            <small>
              <Platforms platforms={data.platforms} />
            </small>
          </h2>
        </>
      ) : (
        <Skeleton className={styles.skeleton} count={10} />
      )}
    </div>
  );
}
