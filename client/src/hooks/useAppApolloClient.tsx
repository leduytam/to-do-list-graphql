import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { useCookies } from 'react-cookie';

const httpLink = new HttpLink({
  uri: 'http://localhost:8080/graphql',
});

const authLink = (token?: string) => {
  return new ApolloLink((operation, forward) => {
    if (token) {
      operation.setContext({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return forward(operation);
  });
};

const cache = new InMemoryCache();

export const useAppApolloClient = () => {
  const [cookies] = useCookies(['accessToken']);

  return new ApolloClient({
    link: authLink(cookies.accessToken).concat(httpLink),
    cache,
    connectToDevTools: true,
  });
};
