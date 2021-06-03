import Vuex, { Module, Store } from 'vuex';
import { useAccessor } from 'typed-vuex';
/**
 * @description Creates and returns a store using the input module and injects the `$accessor` method. Also injects any mocks if provided.
 * @param name The name used by the module.
 * @param module Module created using `getAccessorType`.
 * @param mocks (optional) Objects to be mocked on the store instance.
 * @param appMocks (optional) Objects to be mocked on the Nuxt app instance.
 * @returns store Store with injected `$accessor`.
 * @example
 * const store = createStoreUtil({
      name: 'featureToggleStore',
      module: featureToggleStore,
      mocks: {
        $axios: { $get: jest.fn(() => Promise.resolve({}})) },
      },
    });
 * 
 */
export default function <S>({
  name,
  module,
  mocks,
  appMocks,
}: {
  name: string;
  module: Module<S, S>;
  mocks?: object;
  appMocks?: object;
}): Store<S> {
  const store = new Vuex.Store({
    state: module.state,
    getters: module.getters,
    mutations: module.mutations,
    actions: module.actions,
    modules: module.modules,
  });
  const $accessor = useAccessor(store, {
    modules: {
      [name]: module,
    },
  });

  Object.assign(store, {
    app: { $accessor, ...appMocks },
    ...mocks,
    $accessor,
  });
  return store;
}
