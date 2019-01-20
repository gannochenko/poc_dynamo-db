import { mergeResolvers } from 'merge-graphql-schemas';
import movieResolver from './movie';
import characterResolver from './character';
import weaponResolver from './weapon';

const resolvers = [movieResolver, characterResolver, weaponResolver];

export default mergeResolvers(resolvers);
