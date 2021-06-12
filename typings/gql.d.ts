declare module '*.gql' {
    const content: import('graphql').DocumentNode;
    export default content;
}

declare module '*.graphql' {
    const content: import('graphql').DocumentNode;
    export default content;
}
