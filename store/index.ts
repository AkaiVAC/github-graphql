import { getAccessorType } from 'typed-vuex';
import * as githubStore from '~/store/githubStore';

export const accessorType = getAccessorType({
    modules: { githubStore },
});
