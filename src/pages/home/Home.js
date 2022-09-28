import { useEffect, useState } from "react";
import { getDefaultGames, getGamesByName } from "utils/api";
import Game from "components/game/Game";
import styles from "./home.module.scss";
import "react-loading-skeleton/dist/skeleton.css";
import Search from "components/search/Search";
import { useLocalStorage, useTitle } from "react-use";
import PageLoader from "components/page-loader/PageLoader";
import { toast } from "react-toastify";
import { isPast, parseISO } from "date-fns";
import { openAddGameModal } from "utils/utils";

export default function Home() {
  const [games, setGames] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [showDefault, setShowDefault] = useState(true);
  const [defaultGames, setDefaultGames] = useState([]);
  const [error, setError] = useState("");
  const [averageScore, setAverageScore] = useState(0);
  const [storedQuery, setStoredQuery] = useLocalStorage("query");

  useTitle("playwhat");

  // remove games without release date and released games without esrb rating
  function filterGames(gamesToFilter) {
    const filtered = gamesToFilter.filter((game) => {
      if (!game.released) {
        return false;
      }

      const date = parseISO(game.released);

      if (isPast(date) && game.esrb_rating) {
        return true;
      }

      return false;
    });

    return filtered;
  }

  // get default list of games from api
  async function loadData() {
    setIsLoading(true);

    try {
      // if query is stored, do search
      if (storedQuery) {
        setQuery(storedQuery);
        const response = await getGamesByName(storedQuery);
        setGames(response.data.results);
        setShowDefault(false);
      } else {
        // get default list of games
        const response = await getDefaultGames();
        setDefaultGames(response.data.results);
        setGames(response.data.results);
      }

      setIsLoading(false);
      setIsPageLoading(false);
    } catch {
      setError("There was an error :( please try again");
      setIsLoading(false);
    }
  }

  // on enter key press
  async function search(event) {
    event.preventDefault();

    // save query to local storage to use on future page load
    setStoredQuery(query);

    setGames([]);
    setError("");
    setIsLoading(true);

    // if empty input, display default list of games
    if (!query) {
      setShowDefault(true);

      // get default list of games
      const response = await getDefaultGames();
      setDefaultGames(response.data.results);
      setGames(defaultGames);
      return;
    }

    // search for games with input query
    setIsLoading(true);
    try {
      const response = await getGamesByName(query);
      setGames(filterGames(response.data.results));
    } catch {
      setError("There was an error :( please try again");
    }

    setIsLoading(false);
    setShowDefault(false);
  }

  // get games on page load
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setAverageScore(average.toFixed(0));
  }

  function onInputChange(e) {
    setQuery(e.target.value);
  }

  function addGame() {
    openAddGameModal(submitGame);
  }

  function submitGame(game) {
    // add new game to list of games
    setGames((prevState) => [game, ...prevState]);

    toast(`${game.name} added`, {
      position: toast.POSITION.BOTTOM_CENTER,
      toastId: "visible",
    });
  }

  return (
    <div className={styles.home}>
      {/* search form */}
      <form onSubmit={search}>
        <Search onInputChange={onInputChange} value={query} />
      </form>
      <div className={styles.addGameLink}>
        <p onClick={addGame}>+ add game</p>
      </div>
      {/* results count */}
      {games.length > 0 && !isLoading && !showDefault && (
        <div className={styles.resultsMessage}>
          <div>
            {games.length} result{games.length > 1 && "s"}
          </div>
          {averageScore > 0 && <div>average score: {averageScore}</div>}
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
