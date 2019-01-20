export default {
    Character: {
        movies: async (source, args, { dataSources }, state) => {
            return dataSources.movieSource(source.movies);
        },
        weapon: async (source, args, { dataSources }, state) => {
            return await dataSources.weaponSource.getForCharacter(source.id);
        },
    },
    Mutation: {
        equipWeapon: async (source, args, { dataSources }, state) => {
            const { characterId, weaponId } = args;
            const { weaponSource } = dataSources;

            let result = {};
            try {
                result = weaponSource.giveToCharacter(weaponId, characterId);
            } catch(e) {
                console.error(e);
                result.error = 'Internal error';
            }

            return result;
        },
    },
};
