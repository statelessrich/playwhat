import { Route } from "react-router-dom";
import GameDetail from "pages/game-detail/GameDetail";
import Home from "pages/home/Home";

const routes = [
  <Route key={0} path="/" element={<Home />} />,
  <Route key={1} path="game/:id" element={<GameDetail />} />,
];
export default routes;
