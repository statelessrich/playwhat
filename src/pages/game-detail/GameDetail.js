import { useContext, useEffect } from "react";
import Game from "../../components/game/Game";
import { Context } from "../../utils/Context";
import format from "date-fns/format";
import styles from "./gameDetail.module.scss";
import { useNavigate } from "react-router-dom";
import { getGamesByName } from "../../utils/api";
import { useLocation } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/scss/image-gallery.scss";

export default function GameDetail() {
  const { gameDetails, setGameDetails } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // get game details if none exist
    if (!gameDetails) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    try {
      const slug = location.pathname.split("/")[2];
      const response = await getGamesByName(slug);

      const details = response?.data?.results[0];

      if (details) {
        setGameDetails(details);
      } else {
        // no results
        throw new Error();
      }
    } catch {
      // on error go to home
      navigate("/");
    }
  }

  function Genres() {
    return gameDetails.genres.map(
      (genre, index) => `${genre.name}${index < gameDetails.genres.length - 1 ? "|" : ""}`,
    );
  }

  function getGameImages() {
    // return array of objects containing screenshot image info, skipping the first which is used as hero image
    const images = gameDetails.short_screenshots.slice(1, -1).map((screenshot, index) => ({
      original: screenshot.image,
      thumbnail: screenshot.image,
      originalAlt: `screenshot ${index + 1}`,
    }));
    return images;
  }

  return (
    <div className={styles.gameDetail}>
      {gameDetails ? (
        <>
          {/* game hero section */}
          <Game key={gameDetails.slug} data={gameDetails} isDetailPage />

          {gameDetails.genres && <Genres />}
          {gameDetails.released && <p>Released {format(new Date(gameDetails.released), "MM/dd/yyyy")}</p>}
          {gameDetails.metacritic && <p>Metacritic: {gameDetails.metacritic}</p>}
          {gameDetails.esrb_rating && <p>ESRB: {gameDetails.esrb_rating.name}</p>}

          {/* screenshots carousel */}
          {gameDetails.short_screenshots.length && <ImageGallery items={getGameImages()} />}
        </>
      ) : null}
    </div>
  );
}
