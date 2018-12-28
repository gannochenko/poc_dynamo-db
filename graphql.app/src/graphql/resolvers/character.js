export default {
    Character: {
        movies: async (source, args, { dataSources }, state) => {
            return dataSources.movieSource(source.movies);
        },
    }
};
