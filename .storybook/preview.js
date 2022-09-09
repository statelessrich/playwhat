// export const parameters = {
//   actions: { argTypesRegex: "^on[A-Z].*" },
//   controls: {
//     matchers: {
//       color: /(background|color)$/i,
//       date: /Date$/,
//     },
//   },
// };

import React from "react";
import { Provider } from "../src/utils/Context";
import { BrowserRouter } from "react-router-dom";

// decorate each story with context
export const decorators = [
  (Story) => (
    <BrowserRouter>
      <Provider>
        <Story />
      </Provider>
    </BrowserRouter>
  ),
];
