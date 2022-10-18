import axios from "axios";
import endpoints from "./endpoints";

// rawg api key
const API_KEY = "0564d8ca91e14411a88f067dec3aab6b";

axios.defaults.timeout = 10000;

export function getDefaultGames() {
  // return Promise.reject("error");
  return axios.get(endpoints.games, {
    params: {
      key: API_KEY,
    },
  });
}

export function getGamesByName(query) {
  // return Promise.reject("error");

  return axios.get(endpoints.games, {
    params: {
      key: API_KEY,
      search: query,
      exclude_additions: true,
      search_exact: true,
      page_size: 100,
      ordering: "-released",
    },
  });
}

export function getGamesByGenre(query) {
  return axios.get(endpoints.games, {
    params: {
      key: API_KEY,
      genres: query,
    },
  });
}

export function getGameDetails(id) {
  return axios.get(endpoints.gameDetails(id), {
    params: {
      key: API_KEY,
    },
  });
}

export function getGameScreenshots(id) {
  return axios.get(endpoints.gameScreenshots(id), {
    params: {
      key: API_KEY,
    },
  });
}

export function getPlatforms() {
  return axios.get(endpoints.platforms, {
    params: {
      key: API_KEY,
    },
  });
}
