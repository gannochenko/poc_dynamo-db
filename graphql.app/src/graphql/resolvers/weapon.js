export default {
    Mutation: {
        putWeapon: async (source, args, { dataSources }, state) => {
            const { data } = args;

            let result = {};
            try {
                await dataSources.weaponSource.put(data);
            } catch(e) {
                console.log(e);
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
                console.log(e);
                result.error = 'Internal error';
            }

            return result;
        },
    },
};
