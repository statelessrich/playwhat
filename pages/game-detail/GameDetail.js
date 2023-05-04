import { useEffect, useState } from "react";
import Game from "components/game/Game";
import styles from "./gameDetail.module.scss";
import { useNavigate } from "react-router-dom";
import { getGameDetails, getGameScreenshots } from "../../utils/api";
import { useLocation } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import { useLocalStorage, useTitle } from "react-use";
import { format, isFuture, parseISO } from "date-fns";
import { atcb_init } from "add-to-calendar-button";
import DOMPurify from "dompurify";

import "react-image-gallery/styles/scss/image-gallery.scss";
import "add-to-calendar-button/assets/css/atcb.css";
import { formatGenres } from "../../utils/utils";
import { useMutation } from "react-query";
import { selectGameDetails, updateGameDetails } from "./gameDetailsSlice";
import { useDispatch, useSelector } from "react-redux";

export default function GameDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const id = location.pathname.split("/")[2];
  const [isLoading, setIsLoading] = useState(true);
  const [storedDetails, setStoredDetails] = useLocalStorage(`details-${id}`);
  const gameDetails = useSelector(selectGameDetails);

  // game details mutation
  const { mutate: fetchDetails } = useMutation(() => getGameDetails(id), {
    onSuccess: (response) => {
      // update game details
      dispatch(updateGameDetails(response.data));
      setStoredDetails(response.data);
      setIsLoading(false);

      // load add to calendar button
      atcb_init();
    },
    // go home if error (invalid game id)
    onError: () => navigate("/"),
  });

  // screenshots mutation
  const { mutate: fetchScreenshots } = useMutation(() => getGameScreenshots(id), {
    onSuccess: (response) => dispatch(updateGameDetails({ screenshots: response.data.results })),
  });

  let title = "playwhat";

  if (gameDetails?.name) {
    title += ` - ${gameDetails.name}`;
  }

  // set game name in page title
  useTitle(title);

  useEffect(() => {
    if (!gameDetails) {
      if (storedDetails) {
        // load cached data
        dispatch(updateGameDetails(storedDetails));
        setIsLoading(false);
        fetchScreenshots();
        return;
      }

      // load game details if none exist
      fetchDetails();
    }

    fetchScreenshots();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // return list of genres separated by pipe (|)
  function Genres() {
    return formatGenres(gameDetails.genres);
  }

  // return array of objects containing screenshot image info
  function getGameImages() {
    return gameDetails?.screenshots.map((screenshot, index) => ({
      original: screenshot.image,
      thumbnail: screenshot.image,
      originalAlt: `screenshot ${index + 1}`,
    }));
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
          {/* release date */}
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
      {gameDetails && !isLoading ? (
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
          {gameDetails?.screenshots?.length > 1 && (
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
