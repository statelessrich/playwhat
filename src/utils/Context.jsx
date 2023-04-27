import React, { useState } from "react";

const Context = React.createContext();

const Provider = (props) => {
  const [gameDetails, setGameDetails] = useState(null);

  return (
    <Context.Provider
      value={{
        gameDetails,
        setGameDetails,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};
export { Context, Provider };
