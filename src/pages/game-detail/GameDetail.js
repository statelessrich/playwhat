import { useContext, useEffect, useState } from "react";
import Game from "components/game/Game";
import { Context } from "utils/Context";
import styles from "./gameDetail.module.scss";
import { useNavigate } from "react-router-dom";
import { getGameDetails, getGameScreenshots } from "utils/api";
import { useLocation } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import { useLocalStorage, useTitle } from "react-use";
import { format, isFuture, parseISO } from "date-fns";
import { atcb_init } from "add-to-calendar-button";
import DOMPurify from "dompurify";

import "react-image-gallery/styles/scss/image-gallery.scss";
import "add-to-calendar-button/assets/css/atcb.css";
import { formatGenres } from "utils/utils";

export default function GameDetail() {
  const { gameDetails, setGameDetails } = useContext(Context);
  const [screenshots, setScreenshots] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [storedDetails, setStoredDetails] = useLocalStorage(`details-${id}`);

  let title = "playwhat";

  if (gameDetails?.name) {
    title += ` - ${gameDetails.name}`;
  }

  // set game name in page title
  useTitle(title);

  useEffect(() => {
    if (!gameDetails) {
      // check for cached data
      if (storedDetails) {
        setGameDetails(storedDetails);
        loadScreenshots();
        return;
      }

      // get game details if none exist
      loadData();
    }

    loadScreenshots();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // load add to calendar button after game details
  useEffect(() => {
    atcb_init();
  }, [gameDetails]);

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
        setStoredDetails(details);
      } else {
        // no results
        throw new Error();
      }
    } catch {
      // if error go to home
      navigate("/");
    }
  }

  function Genres() {
    // return list of genres separated by |
    return formatGenres(gameDetails.genres);
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

  // returns release date and calendar button if in future
  function getReleaseDate() {
    if (!gameDetails.released) {
      return;
    }

    const date = parseISO(gameDetails.released);

    if (isFuture(date)) {
      return (
        <>
          <p>Releases {format(new Date(gameDetails.released), "MM/dd/yyyy")}</p>

          {/* add to calendar button */}
          <div className="atcb">
            {"{"}
            "name":"{gameDetails.name} release","startDate": "{gameDetails.released}",
            "startTime":"00:00","endTime":"23:59", "label":"Add to Calendar", "options":[ "Apple", "Google",
            "iCal", "Microsoft365", "Outlook.com", "Yahoo" ],"timeZone":"currentBrowser"{"}"}
          </div>
        </>
      );
    } else {
      <p>Released {format(new Date(gameDetails.released), "MM/dd/yyyy")}</p>;
    }
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
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(gameDetails.description) }}></div>

            <div>
              {/* list of genres */}
              {gameDetails.genres && (
                <p>
                  <Genres />
                </p>
              )}

              {/* release date */}
              {getReleaseDate()}

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
      ) : (
        <Game isLoading />
      )}
    </div>
  );
}
