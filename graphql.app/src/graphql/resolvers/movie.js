const movies = [
    {
        id: '1',
        title: 'A New Hope',
        characters: [1, 2, 3, 4, 5],
    },
    {
        id: '2',
        title: 'The Empire Strikes Back',
        characters: [1, 2, 3],
    },
    {
        id: '3',
        title: 'Return of the Jedi',
        characters: [30, 31, 45],
    },
];

export default {
    Query: {
        movies: async (source, args, context, state) => {
            return movies;
        },
        movie: async (source, args, context, state) => {
            // by using "args" argument we can get access
            // to query arguments
            const { id } = args;
            return movies.find(movie => movie.id === id);
        },
    },

    Movie: {
        movie: async (source, args, context, state) => {
            console.dir(source);
            return [];
        },
    }
};
