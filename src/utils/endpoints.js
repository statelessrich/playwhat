const endpoints = {
  games: "https://api.rawg.io/api/games",
  gameDetails: (id) => `https://api.rawg.io/api/games/${id}`,
  gameScreenshots: (id) => `https://api.rawg.io/api/games/${id}/screenshots`,
};

export default endpoints;
