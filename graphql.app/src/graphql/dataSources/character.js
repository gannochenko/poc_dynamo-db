import axios from 'axios';

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
        if (cache[id]) {
            result.push(cache[id]);
        } else {
            missing.push(id);
        }
    });

    if (missing.length) {
        (await Promise.all(
            missing.map(
                id => axios.get(`https://swapi.co/api/people/${id}/`).catch(() => null)
            )
        )).forEach(res => {
            if (res) {
                const data = res.data;
                const found = data.url.match(/(\d+)\/$/);
                if (found.length) {
                    const character = {
                        id: extractId(data.url),
                        fullName: data.name,
                        movies: data.films.map(filmURL => extractId(filmURL)),
                    };

                    cache[character.id] = character;
                    result.push(character);
                }
            }
        });
    }

    return result.filter(x => !!x);
};
