import { useEffect, useState } from "react";
import { getDefaultGames, getGamesByName } from "src/utils/api";
import Game from "src/components/game/Game";
import styles from "./home.module.scss";
import "react-loading-skeleton/dist/skeleton.css";
import Search from "src/components/search/Search";
import { useLocalStorage, useTitle } from "react-use";
import { toast } from "react-toastify";
import { isBefore, isPast, parseISO } from "date-fns";
import { openAddGameModal } from "src/utils/utils";
import { useSelector, useDispatch } from "react-redux";
import { selectGames, updateGames, deleteGames } from "src/pages/home/gamesSlice";
import { createGame } from "src/pages/home/gamesSlice";
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
    onSuccess: (response) => {
      dispatch(updateGames(response.data.results));
      setShowDefault(true);
      setQuery("");
      setStoredQuery("");
    },
    onMutate: () => setIsLoading(true),
  });

  // search games by name mutation
  const { error: searchError, mutate: fetchGamesByName } = useMutation((query) => getGamesByName(query), {
    refetchOnWindowFocus: false,
    onSettled: () => setisSearchLoading(false),
    onSuccess: (response) => {
      dispatch(updateGames(filterGames(response.data.results)));
      calcAverageScore(response.data.results);
      setShowDefault(false);
    },
  });

  useTitle("playwhat");

  // remove games without release date, sort by newest
  function filterGames(gamesToFilter) {
    const filtered = gamesToFilter.filter((game) => {
      if (!game.released) {
        return false;
      }

      const date = parseISO(game.released);

      if (isPast(date)) {
        return true;
      }

      return false;
    });

    filtered.sort(function (a, b) {
      return isBefore(parseISO(a.released), parseISO(b.released)) ? 0 : -1;
    });

    return filtered;
  }

  // get default list of games from api
  async function loadData() {
    // if query saved, do search
    if (storedQuery) {
      setQuery(storedQuery);
      fetchGamesByName(storedQuery);
    } else {
      // get default list of games
      fetchDefaultGames();
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
      fetchDefaultGames();

      return;
    }

    // search for games with input query
    setisSearchLoading(true);
    fetchGamesByName(query);
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
      setQuery("");
      setShowDefault(true);
    } else {
      // get default list of games
      fetchDefaultGames();
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
