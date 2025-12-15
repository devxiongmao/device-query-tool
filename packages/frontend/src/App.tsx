import { ApolloProvider } from "@apollo/client/react";
import { RouterProvider } from "react-router-dom";
import { apolloClient } from "./config/apollo";
import { router } from "./routes";

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <RouterProvider router={router} />
    </ApolloProvider>
  );
}

export default App;
