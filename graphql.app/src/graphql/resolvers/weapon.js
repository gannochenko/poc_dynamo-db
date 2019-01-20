export default {
    Mutation: {
        putWeapon: async (source, args, { dataSources }, state) => {
            const { data } = args;

            let result = {};
            try {
                await dataSources.weaponSource.put(data);
            } catch(e) {
                console.error(e);
                result.error = 'Internal error';
            }

            return result;
        },
        deleteWeapon: async (source, args, { dataSources }, state) => {
            const { id } = args;

            let result = {};
            try {
                await dataSources.weaponSource.delete(id);
            } catch(e) {
                console.error(e);
                result.error = 'Internal error';
            }

            return result;
        },
    },
};
