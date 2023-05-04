const endpoints = {
  games: "https://api.rawg.io/api/games",
  gameDetails: (id) => `https://api.rawg.io/api/games/${id}`,
  gameScreenshots: (id) => `https://api.rawg.io/api/games/${id}/screenshots`,
  platforms: "https://api.rawg.io/api/platforms",
};

export default endpoints;
