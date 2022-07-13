import { useEffect, useState } from "react";
import { getDefaultGames, getGamesByName } from "../../utils/api";
import Game from "../../components/game/Game";
import styles from "./home.module.scss";
import "react-loading-skeleton/dist/skeleton.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [games, setGames] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDefault, setShowDefault] = useState(true);
  const [defaultGames, setDefaultGames] = useState([]);
  const [error, setError] = useState("");
  const [averageScore, setAverageScore] = useState(0);

  // get default list of games from api
  async function loadData() {
    setIsLoading(true);

    try {
      const response = await getDefaultGames();
      setDefaultGames(response.data.results);
      setGames(response.data.results);
      setIsLoading(false);
    } catch {
      setError("There was an error :( please try again");
      setIsLoading(false);
    }
  }

  // on enter key press
  async function search(event) {
    event.preventDefault();
    setGames([]);
    setError("");

    // if empty input, display default list of games
    if (!query) {
      setShowDefault(true);
      setGames(defaultGames);
      return;
    }

    // search for games with input
    setIsLoading(true);

    try {
      const response = await getGamesByName(query);
      setGames(response.data.results);
    } catch {
      setError("There was an error :( please try again");
    }

    setIsLoading(false);
    setShowDefault(false);
  }

  // get games on page load
  useEffect(() => {
    loadData();
  }, []);

  // update average score after search
  useEffect(() => {
    if (games.length) {
      calcAverageScore(games);
    }
  }, [games]);

  function calcAverageScore(gameList) {
    if (!gameList.length) {
      return;
    }

    // get games with metacritic scores
    const scoredGames = gameList.filter((game) => game.metacritic);

    // add up scores
    let score = 0;
    scoredGames.forEach((game) => {
      score += game.metacritic || 0;
    });

    // return average score
    const average = score / scoredGames.length || 0;
    setAverageScore(average);
  }

  function onInputChange(e) {
    setQuery(e.target.value);
  }

  return (
    <div className={styles.home}>
      {/* search form */}
      <form onSubmit={search}>
        <div className={styles.search}>
          <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.magnifyingGlass} />
          {/* search input */}
          <input
            type="text"
            onChange={onInputChange}
            placeholder="Mario, Elden Ring, etc."
            className={styles.search}
          ></input>
          {/* <input type="submit" value="search" onClick={search}></input> */}
        </div>
      </form>

      {/* results count */}
      {games.length > 0 && !isLoading && !showDefault && (
        <div className={styles.resultsMessage}>
          <div>{games.length} results</div>
          {averageScore > 0 && <div>average score: {averageScore}</div>}
          {/* {<div>average score: {calcAverageScore(games)}</div>} */}
        </div>
      )}

      {/* no results message */}
      {!games.length && !isLoading && !error && <div className={styles.resultsMessage}>no results :(</div>}

      {/* error message */}
      {error && !isLoading && <div className={`${styles.resultsMessage} error`}>{error}</div>}

      {/* list of games  */}
      {games?.map((game) => (
        <Game key={game.slug} data={game} />
      ))}

      {/* loading skeleton graphics */}
      {isLoading && (
        <>
          <Game isLoading />
          <Game isLoading />
          <Game isLoading />
        </>
      )}
    </div>
  );
}
