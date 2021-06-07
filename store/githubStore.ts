import { getAccessorType } from 'typed-vuex';
import getAllOpenPRData from '~/schema/GetAllOpenPRData.gql';
import MergePR from '~/schema/MergePR.gql';
import ClosePR from '~/schema/ClosePR.gql';
import GetProjectLevelPRs from '~/schema/GetProjectLevelPRs.gql';

export const state = () => ({
  projects: {} as GitHubStore.Full_PR_Data,
  prs: {} as GitHubStore.Project_PR_Data,
});

export const getters: GitHubStore.Getters = {
  getRepos(state) {
    const repos: Array<string> = [];
    state.projects.data.viewer.repositories.nodes.forEach((node) =>
      repos.push(node.name)
    );
    return () => repos;
  },
  getAllOpenPRData(state) {
    const filteredRepos: Array<unknown> = [];
    state.projects.data.viewer.repositories.nodes.filter(
      (node) =>
        node.pullRequests.nodes.length > 0 &&
        filteredRepos.push({
          id: node.id,
          repo: node.name,
          prs: node.pullRequests.nodes,
        })
    );

    return () => filteredRepos as Array<GitHubStore.PR_Data>;
  },
  getPRDataByRepo(state, getters) {
    const allOpenPRs = getters.getAllOpenPRData(state)();
    return (repoId) => {
      const requiredRepo = allOpenPRs.filter((repo) => repo.id === repoId)[0];
      return requiredRepo;
    };
  },
};

export const mutations: GitHubStore.Mutations = {
  SET_PROJECT_DATA(state, payload) {
    state.projects = payload;
  },
  SET_PR_DATA(state, payload) {
    state.prs = payload;
  },
};

export const actions: GitHubStore.Actions = {
  async GET_PR_DATA_FROM_API(this) {
    const data = (await this.app.apolloProvider?.defaultClient.query({
      query: getAllOpenPRData,
      context: {
        headers: {
          Authorization: `Bearer ${this.app.$config.token}`,
        },
      },
    })) as GitHubStore.Full_PR_Data;
    this.$accessor.githubStore.SET_PROJECT_DATA(data);
    return data as GitHubStore.Full_PR_Data;
  },
  async GET_PROJECT_PR_FROM_API(this, {}, repoName) {
    const data = (await this.app.apolloProvider?.defaultClient.query({
      query: GetProjectLevelPRs,
      context: {
        headers: {
          Authorization: `Bearer ${this.app.$config.token}`,
        },
      },
      variables: {
        repoName,
      },
    })) as Record<'data', { viewer: { repository: object } }>;

    this.$accessor.githubStore.SET_PR_DATA(
      data.data.viewer.repository as GitHubStore.Project_PR_Data
    );
    return data.data.viewer.repository as GitHubStore.Project_PR_Data;
  },
  async CLOSE_PR(this, {}, pullRequestId) {
    const result = await this.app.apolloProvider?.defaultClient.mutate({
      mutation: ClosePR,
      variables: {
        pullRequestId,
      },
      context: {
        headers: {
          Authorization: `Bearer ${this.app.$config.token}`,
        },
      },
    });
    this.$accessor.githubStore.GET_PR_DATA_FROM_API();
    return result as GitHubStore.Close_Result;
  },
  async MERGE_PR(this, {}, pullRequestId) {
    const result = await this.app.apolloProvider?.defaultClient.mutate({
      mutation: MergePR,
      variables: {
        pullRequestId,
      },
      context: {
        headers: {
          Authorization: `Bearer ${this.app.$config.token}`,
        },
      },
    });
    this.$accessor.githubStore.GET_PR_DATA_FROM_API();
    return result as GitHubStore.Merge_Result;
  },
};

export const accessorType = getAccessorType({
  state,
  mutations,
  actions,
  modules: {},
});
