import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// 1. Création du lien HTTP vers l'API GraphQL
const httpLink = createHttpLink({
  // L'URL de l'API GraphQL est définie ici.
  // '/graphql' est utilisé pour pointer vers le backend sur le même domaine/port.
  uri: '/graphql',
  credentials: 'include',
});

// 2. Création et configuration du client Apollo
export const client = new ApolloClient({
  link: httpLink,
  // Mise en cache des résultats des requêtes
  cache: new InMemoryCache(),
  // Politique de récupération des données par défaut : network-only garantit
  // que les données sont toujours récupérées auprès du serveur
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
    },
    query: {
      fetchPolicy: 'network-only',
    },
  },
});