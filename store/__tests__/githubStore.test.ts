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

	const samplePRData: GitHubStore.Project_PR_Data = {
		name: 'some_name',
		pullRequests: {
			nodes: [
				{
					author: {
						avatarUrl: 'http://avatar-url',
						login: 'author-login',
						url: 'author-url',
					},
					id: 'some_id',
					number: 12,
					potentialMergeCommit: {
						abbreviatedOid: '123-id',
						changedFiles: 2,
					},
					title: 'some_title',
					url: 'http://some_url',
				},
				{
					author: {
						avatarUrl: 'http://avatar-url',
						login: 'author-login',
						url: 'author-url',
					},
					id: 'some_id_2',
					number: 13,
					potentialMergeCommit: {
						abbreviatedOid: '1233-id',
						changedFiles: 2,
					},
					title: 'some_title_2',
					url: 'http://some_url_2',
				},
			],
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
			mocks: {
				window: {
					location: {
						reload: () => jest.fn(),
					},
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
		it('sets projects state to correct value when "SET_PROJECT_DATA" is fired', () => {
			typedStore.SET_PROJECT_DATA(samplePRs);
			expect(typedStore.projects).toStrictEqual(samplePRs);
		});
		it('sets PRs to correct value when "SET_PR_DATA" is fired', () => {
			typedStore.SET_PR_DATA(samplePRData);
			expect(typedStore.prs).toStrictEqual(samplePRData);
		});
		it('updates PRs to correct value when "UPDATE_PR_DATA" is fired', () => {
			store.state.prs = samplePRData;
			typedStore.UPDATE_PR_DATA('some_id');
			expect(typedStore.prs.pullRequests.nodes.length).toBe(1);
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
			store.state.prs = samplePRData;
			const spyCommit = jest.spyOn(typedStore, 'MERGE_PR');
			const spyDispatch = jest.spyOn(typedStore, 'UPDATE_PR_DATA');
			const result = await typedStore.MERGE_PR('some_id');

			expect(spyCommit).toHaveBeenCalled();
			expect(spyDispatch).toHaveBeenCalled();
			expect(result).toStrictEqual(sampleMergeResult);
		});
	});
});
