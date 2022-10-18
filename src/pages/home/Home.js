import { useEffect, useState } from "react";
import { getDefaultGames, getGamesByName } from "utils/api";
import Game from "components/game/Game";
import styles from "./home.module.scss";
import "react-loading-skeleton/dist/skeleton.css";
import Search from "components/search/Search";
import { useLocalStorage, useTitle } from "react-use";
import { toast } from "react-toastify";
import { isPast, parseISO } from "date-fns";
import { openAddGameModal } from "utils/utils";
import { useSelector, useDispatch } from "react-redux";
import { selectGames, updateGames, deleteGames } from "pages/home/gamesSlice";
import { createGame } from "pages/home/gamesSlice";
import { useMutation } from "react-query";

export default function Home() {
  const games = useSelector(selectGames);
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [showDefault, setShowDefault] = useState(true);
  const [averageScore, setAverageScore] = useState(0);
  const [storedQuery, setStoredQuery] = useLocalStorage("query");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchLoading, setisSearchLoading] = useState(false);

  // default games mutation
  const {
    error,
    data: defaultGames = [],
    mutate: fetchDefaultGames,
  } = useMutation(getDefaultGames, {
    refetchOnWindowFocus: false,
    onSettled: () => setIsLoading(false),
    onSuccess: (response) => dispatch(updateGames(response.data.results)),
  });

  // search games by name mutation
  const { error: searchError, mutate: fetchGamesByName } = useMutation((query) => getGamesByName(query), {
    refetchOnWindowFocus: false,
    onSettled: () => setisSearchLoading(false),
    onSuccess: (response) => {
      dispatch(updateGames(filterGames(response.data.results)));
      calcAverageScore(response.data.results);
    },
  });

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
    // if query is stored, do search
    if (storedQuery) {
      setQuery(storedQuery);
      fetchGamesByName(storedQuery);
    } else {
      // get default list of games
      fetchDefaultGames();
      setShowDefault(true);
    }
  }

  // on enter key press
  async function search(event) {
    event.preventDefault();
    // save query to local storage to use on future page load
    setStoredQuery(query);
    dispatch(deleteGames());

    // if empty input, display default list of games
    if (!query) {
      setShowDefault(true);
      setIsLoading(true);
      fetchDefaultGames();
      setQuery("");
      setStoredQuery("");
      return;
    }

    // search for games with input query
    setisSearchLoading(true);
    fetchGamesByName(query);
    setShowDefault(false);
  }

  // get games on page load
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  async function submitGame(game) {
    // show default games
    if (defaultGames?.data?.results) {
      dispatch(updateGames(defaultGames.data.results));
    } else {
      // get default list of games
      fetchDefaultGames();
      setShowDefault(true);
      setQuery("");
      setStoredQuery("");
    }

    // add new game to list of games
    dispatch(createGame(game));

    // show game added toast message
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

      {/* add game link */}
      <div className={styles.addGameLink}>
        <p onClick={addGame}>+ add game</p>
      </div>

      {/* results count */}
      {games.length > 0 && !showDefault && (
        <div className={styles.resultsMessage}>
          <div>
            {games.length} result{games.length > 1 && "s"}
          </div>
          {averageScore > 0 && <div>average score: {averageScore}</div>}
        </div>
      )}

      {/* no results message */}
      {!games?.length && !isLoading && !isSearchLoading && !error && !searchError && (
        <div className={styles.resultsMessage}>no results :(</div>
      )}

      {/* error message */}
      {(error || searchError) && (
        <div className={`${styles.resultsMessage} error`}>{error || searchError}</div>
      )}

      {/* list of games  */}
      {games?.map((game) => (
        <Game key={game.slug} data={game} />
      ))}

      {/* loading skeleton graphics */}
      {(isLoading || isSearchLoading) && (
        <>
          <Game isLoading />
          <Game isLoading />
          <Game isLoading />
        </>
      )}
    </div>
  );
}
