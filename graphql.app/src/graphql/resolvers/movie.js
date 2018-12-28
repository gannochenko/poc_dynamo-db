export default {
    Query: {
        movies: async (source, args, { dataSources }, state) => {
            return dataSources.movieSource(null);
        },
        movie: async (source, args, { dataSources }, state) => {
            // by using "args" argument we can get access
            // to query arguments
            const { id } = args;

            const result = dataSources.movieSource([id]);
            if (result && result[0]) {
                return result[0];
            }

            return null;
        },
    },

    Movie: {
        characters: async (source, args, { dataSources }) => {
            console.dir('Executing Movie.characters resolver');
            return dataSources.characterSource(source.characters);
        },
    }
};
