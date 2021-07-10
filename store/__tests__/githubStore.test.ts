import Vuex, { Store } from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import createStoreUtil from '@/utils/createStoreUtil';
import * as githubStore from '../githubStore';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('GitHub Store', () => {
	let store: Store<GitHubStore.State>;
	let typedStore: typeof store.app.$accessor.githubStore;

	const samplePRs: GitHubStore.Full_PR_Data = {
		data: {
			viewer: {
				login: 'AkaiVAC',
				repositories: {
					nodes: [
						{
							id: '1',
							name: 'Some Repo',
							url: 'repo_url',
							pullRequests: {
								nodes: [
									{ id: 'some_id', url: 'some_url' },
									{
										id: 'some_other_id',
										url: 'some_other_url',
									},
								],
							},
						},
						{
							id: '2',
							name: 'Some Other Repo',
							url: 'repo_url',
							pullRequests: {
								nodes: [
									{ id: 'some_id', url: 'some_url' },
									{
										id: 'some_other_id',
										url: 'some_other_url',
									},
								],
							},
						},
					],
				},
			},
		},
	};

	const sampleMergeResult: GitHubStore.Merge_Result = {
		data: {
			mergePullRequest: {
				pullRequest: {
					id: 'some_id',
					merged: true,
				},
			},
		},
	};

	beforeEach(() => {
		store = createStoreUtil({
			name: 'githubStore',
			module: githubStore,
			appMocks: {
				apolloProvider: {
					defaultClient: {
						query: jest
							.fn()
							.mockImplementation(() =>
								Promise.resolve(samplePRs),
							),
						mutate: jest
							.fn()
							.mockImplementation(() =>
								Promise.resolve(sampleMergeResult),
							),
					},
				},
				$config: {
					token: 'sample_token',
				},
			},
		});
		typedStore = store.app.$accessor.githubStore;
	});

	describe('Getters', () => {
		it('gets all repository names when "getRepos" is fired', () => {
			store.state.projects = samplePRs;
			const allRepos = typedStore.getRepos();
			expect(allRepos).toStrictEqual(['Some Repo', 'Some Other Repo']);
		});
		it('gets PR Data by repo in the expected format when "getAllOpenPRData" is fired', () => {
			store.state.projects = samplePRs;
			const dataFromGetter = typedStore.getAllOpenPRData();
			expect(dataFromGetter).toStrictEqual([
				{
					id: '1',
					repo: 'Some Repo',
					prs: [
						{ id: 'some_id', url: 'some_url' },
						{ id: 'some_other_id', url: 'some_other_url' },
					],
				},
				{
					id: '2',
					repo: 'Some Other Repo',
					prs: [
						{ id: 'some_id', url: 'some_url' },
						{ id: 'some_other_id', url: 'some_other_url' },
					],
				},
			]);
		});
		it('gets repository specific PRs when "getPRDataByRepo" is fired', () => {
			store.state.projects = samplePRs;
			const repoPRs = typedStore.getPRDataByRepo('1');
			expect(repoPRs).toStrictEqual({
				id: '1',
				repo: 'Some Repo',
				prs: [
					{ id: 'some_id', url: 'some_url' },
					{ id: 'some_other_id', url: 'some_other_url' },
				],
			});
		});
	});

	describe('Mutations', () => {
		it('sets PRs to correct value when "SET_PROJECT_DATA" is fired', () => {
			typedStore.SET_PROJECT_DATA(samplePRs);
			expect(typedStore.projects).toStrictEqual(samplePRs);
		});
	});

	describe('Actions', () => {
		it('gets Pull Request data from API when "GET_PR_DATA_FROM_API" is fired', async () => {
			const spyCommit = jest.spyOn(typedStore, 'GET_PR_DATA_FROM_API');
			await typedStore.GET_PR_DATA_FROM_API();

			expect(spyCommit).toHaveBeenCalled();
			expect(typedStore.projects).toStrictEqual(samplePRs);
		});
		it('merges Pull Request based on ID when "MERGE_PR" is fired', async () => {
			const spyCommit = jest.spyOn(typedStore, 'MERGE_PR');
			const spyDispatch = jest.spyOn(typedStore, 'GET_PR_DATA_FROM_API');
			const result = await typedStore.MERGE_PR('some_id');

			expect(spyCommit).toHaveBeenCalled();
			expect(spyDispatch).toHaveBeenCalled();
			expect(result).toStrictEqual(sampleMergeResult);
		});
	});
});
