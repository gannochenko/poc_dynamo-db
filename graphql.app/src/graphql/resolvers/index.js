import { mergeResolvers } from 'merge-graphql-schemas';
import movieResolver from './movie';
import characterResolver from './character';

const resolvers = [movieResolver, characterResolver];

export default mergeResolvers(resolvers);
