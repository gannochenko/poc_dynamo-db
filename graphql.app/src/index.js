import { ApolloServer } from 'apollo-server-lambda';
import resolvers from './graphql/resolvers';
import typeDefs from './graphql/types';
import characterSource from './graphql/dataSources/character';
import movieSource from './graphql/dataSources/movie';

// creating the server
const server = new ApolloServer({

    // passing types and resolvers to the server
    typeDefs,
    resolvers,

    // initial context state, will be available in resolvers
    context: () => ({}),

    // an object that goes to the "context" argument
    // when executing resolvers
    dataSources: () => {
        return {
            characterSource,
            movieSource,
        };
    },
});

const handler = (event, context, callback) => {
    const handler = server.createHandler();

    // tell AWS lambda we do not want to wait for NodeJS event loop
    // to be empty in order to send the response
    context.callbackWaitsForEmptyEventLoop = false;

    // process the request
    return handler(event, context, callback);
};

export default handler;
