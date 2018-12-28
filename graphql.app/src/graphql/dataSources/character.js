import axios from 'axios';

// such kind of memoization is not good for production
// use it like this only for demo purposes,
// normally it is better to have something
// like Redis here
const cache = {};

const extractId = (url) => {
    const found = url.match(/(\d+)\/$/);
    if (found.length) {
        return found[1];
    }

    return null;
};

export default async (ids) => {
    if (!ids || !ids.length) {
        return [];
    }

    const result = [];
    const missing = [];
    ids.forEach((id) => {
        // check what we already have in the cache
        if (cache[id]) {
            result.push(cache[id]);
        } else {
            missing.push(id);
        }
    });

    if (missing.length) {
        // still having cache miss? request then!
        (await Promise.all(
            missing.map(
                id => axios.get(
                    `https://swapi.co/api/people/${id}/`
                ).catch(() => null)
            )
        )).forEach(res => {
            // process the result as it does not
            // have an appropriate format
            if (res) {
                const data = res.data;
                const id = extractId(data.url);
                if (id) {
                    const character = {
                        id,
                        fullName: data.name,
                        movies: data.films.map(
                            filmURL => extractId(filmURL)
                        ),
                    };

                    // put to the cache
                    cache[character.id] = character;
                    // and to the result
                    result.push(character);
                }
            }
        });
    }

    return result.filter(x => !!x);
};
