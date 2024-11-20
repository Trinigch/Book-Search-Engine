import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// Configuración de la URI del servidor GraphQL (aquí es localhost, pero puede ser una URL de producción)
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql', // Cambia esta URL a la de tu servidor GraphQL
});

// Creación del cliente de Apollo
const client = new ApolloClient({
  link: httpLink, // Establece el link HTTP para las solicitudes
  cache: new InMemoryCache(), // Configura el caché en memoria para almacenar datos
});

export default client;