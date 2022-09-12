import { useContext, useEffect, useState } from "react";
import Game from "components/game/Game";
import { Context } from "utils/Context";
import format from "date-fns/format";
import styles from "./gameDetail.module.scss";
import { useNavigate } from "react-router-dom";
import { getGameDetails, getGameScreenshots } from "utils/api";
import { useLocation } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/scss/image-gallery.scss";
import { useTitle } from "react-use";

export default function GameDetail() {
  const { gameDetails, setGameDetails } = useContext(Context);
  const [screenshots, setScreenshots] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.pathname.split("/")[2];

  // set game name in page title
  useTitle("playwhat - " + gameDetails.name);

  useEffect(() => {
    // get game details if none exist
    if (!gameDetails) {
      loadData();
    }

    loadScreenshots();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadScreenshots() {
    const screenshotResponse = await getGameScreenshots(id);
    setScreenshots(screenshotResponse?.data?.results);
  }

  async function loadData() {
    try {
      // get game details using id from url
      const response = await getGameDetails(id);
      const details = response.data;

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
    // return list of genres separated by |
    return gameDetails.genres.map(
      (genre, index) => `${genre.name}${index < gameDetails.genres.length - 1 ? "|" : ""}`,
    );
  }

  function getGameImages() {
    // return array of objects containing screenshot image info
    const images = screenshots.map((screenshot, index) => ({
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

          {/* game details */}
          <div className={styles.details}>
            {/* description */}
            <div dangerouslySetInnerHTML={{ __html: gameDetails.description }}></div>

            {/* other details */}
            <div>
              {gameDetails.genres && (
                <p>
                  <Genres />
                </p>
              )}

              {/* release date */}
              {gameDetails.released && <p>Released {format(new Date(gameDetails.released), "MM/dd/yyyy")}</p>}

              {/* metacritic score */}
              {gameDetails.metacritic && <p>Metacritic: {gameDetails.metacritic}</p>}

              {/* esrb rating */}
              {gameDetails.esrb_rating && <p>ESRB: {gameDetails.esrb_rating.name}</p>}
            </div>
          </div>

          {/* screenshots carousel */}
          {screenshots.length > 1 && (
            <div className={styles.screenshots}>
              <ImageGallery items={getGameImages()} />
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
