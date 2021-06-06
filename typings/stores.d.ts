declare module GitHubStore {
  type State = ReturnType<typeof import('@/store/githubStore').state>;
  type Store = import('vuex').Store<State>;
  type ActionContext = import('vuex').ActionContext<State, State>;

  type Full_PR_Data = {
    data: {
      viewer: {
        login: string;
        repositories: {
          nodes: Array<{
            id: string;
            name: string;
            url: string;
            pullRequests: {
              nodes: Array<{
                id: string;
                url: string;
              }>;
            };
          }>;
        };
      };
    };
  };

  type Project_PR_Data = {
    name: string;
    pullRequests: {
      nodes: [
        {
          id: string;
          number: number;
          title: string;
          url: string;
          author: {
            avatarUrl: string;
            login: string;
            url: string;
          };
          potentialMergeCommit: {
            abbreviatedOid: string;
            changedFiles: 2;
          };
        }
      ];
    };
  };

  type Merge_Result = {
    data: {
      mergePullRequest: {
        pullRequest: {
          id: string;
          merged: boolean;
        };
      };
    };
  };

  type PR_Data = {
    id: string;
    repo: string;
    prs: Array<Record<'id' | 'url', string>>;
  };

  type Getters<S = State> = {
    getRepos(state: S): () => string[];
    getAllOpenPRData(state: S): () => Array<PR_Data>;
    getPRDataByRepo(state: S, getters: Getters): (repoId: string) => PR_Data;
  };

  type Mutations<S = State> = {
    SET_PROJECT_DATA(state: S, payload: Full_PR_Data): void;
    SET_PR_DATA(state: S, payload: Project_PR_Data): void;
  };

  type Actions = {
    GET_PR_DATA_FROM_API(this: Store): Promise<Full_PR_Data>;
    GET_PROJECT_PR_FROM_API(
      this: Store,
      { state, commit }: ActionContext,
      repoName: string
    ): Promise<Project_PR_Data>;
    MERGE_PR(
      this: Store,
      { state, commit }: ActionContext,
      pullRequestId: string
    ): Promise<Merge_Result>;
  };
}
