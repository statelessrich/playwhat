import { useContext, useEffect } from "react";
import Game from "../../components/game/Game";
import { Context } from "../../utils/Context";
import format from "date-fns/format";
import styles from "./gameDetail.module.scss";
// import { useNavigate } from "react-router-dom";
// import { getGamesByName } from "../../utils/api";

export default function GameDetail() {
  const { gameDetails } = useContext(Context);
  // const navigate = useNavigate();

  useEffect(() => {
    if (!gameDetails) {
      // get game details if none exist
      //   navigate("/");
    //   getGamesByName(window.location.);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function Genres() {
    return gameDetails.genres.map(
      (genre, index) => `${genre.name}${index < gameDetails.genres.length - 1 ? "|" : ""}`,
    );
  }

  return (
    <div className={styles.gameDetail}>
      {gameDetails ? (
        <>
          <Game key={gameDetails.slug} data={gameDetails} isDetailPage />
          {gameDetails.genres && <Genres />}
          {gameDetails.released && <p>Released {format(new Date(gameDetails.released), "MM/dd/yyyy")}</p>}
          {gameDetails.metacritic && <p>Metacritic: {gameDetails.metacritic}</p>}
          {gameDetails.esrb_rating && <p>ESRB: {gameDetails.esrb_rating.name}</p>}
        </>
      ) : null}
    </div>
  );
}
