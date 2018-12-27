import { mergeTypes } from 'merge-graphql-schemas';

import movie from './movie.graphql';
import character from './character.graphql';

export default mergeTypes(
    [movie, character],
    { all: true },
);
