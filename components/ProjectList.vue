<template>
	<v-card :loading="loading">
		<code class="v-card__title pl-4"> Projects With Open PRs </code>
		<v-list>
			<v-list-item-group>
				<v-list-item
					two-line
					v-for="repo in prsByRepos"
					:key="repo.id"
					@click="openPRList(repo.repo)"
				>
					<v-list-item-content>
						<v-list-item-title class="text-subtitle-1">{{
							repo.repo
						}}</v-list-item-title>
						<v-list-item-subtitle class="text-caption">
							ID:&nbsp;{{ repo.id }}
						</v-list-item-subtitle>
					</v-list-item-content>
					<v-list-item-action>
						<v-btn
							tile
							icon
							small
							title="Open PR Count"
							:class="colorByPRCount(repo.prs.length)"
							color="white"
						>
							{{ repo.prs.length }}
						</v-btn>
					</v-list-item-action>
				</v-list-item>
			</v-list-item-group>
		</v-list>
	</v-card>
</template>
<script lang="ts">
	import Vue from 'vue';

	export default Vue.extend({
		async fetch() {
			await this.$accessor.githubStore.GET_PR_DATA_FROM_API();
			this.repos = this.$accessor.githubStore.getRepos();
			this.prsByRepos = this.$accessor.githubStore.getAllOpenPRData();
			this.loading = !this.loading;
		},
		data: () => ({
			author: '',
			repos: [] as Array<string>,
			prsByRepos: [
				{ id: '', repo: '', prs: [{ id: '', url: '' }] },
			] as Array<GitHubStore.PR_Data>,
			loading: true,
		}),
		methods: {
			colorByPRCount(prCount: number): string {
				if (prCount > 10 && prCount < 10) return 'warning';
				if (prCount > 10) return 'error';
				return 'success';
			},
			async openPRList(name: string): Promise<void> {
				await this.$accessor.githubStore.GET_PROJECT_PR_FROM_API(name);
			},
		},
	});
</script>
<style lang="scss" scoped>
	.v-list {
		max-height: 78vmin;
		overflow-y: auto;
	}
</style>
