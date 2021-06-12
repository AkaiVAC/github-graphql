declare type globalAdditions = {
    $accessor: typeof import('@/store').accessorType;
    $vuetify: import('vuetify').Framework;
};
declare module 'vue/types/vue' {
    interface Vue extends globalAdditions {}
}
declare module '@nuxt/types' {
    interface Context extends globalAdditions {}
    interface NuxtAppOptions extends globalAdditions {}
}
declare module 'vuex/types/index' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Store<S> extends globalAdditions {}
}

export {};
