import { mergeTypes } from 'merge-graphql-schemas';

import util from './util.graphql';
import movie from './movie.graphql';
import character from './character.graphql';
import weapon from './weapon.graphql';

export default mergeTypes(
    [util, movie, character, weapon],
    { all: true },
);
