<template>
	<v-card class="fill-height" :loading="loading">
		<div
			v-if="prs.name === undefined"
			class="fill-height d-flex flex-column justify-center align-center"
		>
			<v-icon size="80" class="mb-4">{{ icons.mdiGithub }}</v-icon>
			<h3>Select a Project to View PRs</h3>
		</div>
		<v-card-text v-else>
			<h2 class="font-weight-light mb-3">
				<v-chip
					link
					label
					class="transparent text-h6"
					:href="repoUrl(prs.name)"
					target="_blank"
					title="Open PR in a new tab"
				>
					{{ prs.name }}&nbsp;
					<v-icon small>{{ icons.mdiOpenInNew }}</v-icon>
				</v-chip>
			</h2>
			<PRList :prs="prs" @send="forceRerender" />
		</v-card-text>
	</v-card>
</template>
<script lang="ts">
	import Vue from 'vue';
	import { mdiGithub, mdiOpenInNew, mdiClipboardOutline } from '@mdi/js';
	export default Vue.extend({
		data: () => ({
			icons: { mdiGithub, mdiOpenInNew, mdiClipboardOutline },
			prs: {} as GitHubStore.Project_PR_Data,
			loading: false,
		}),
		created() {
			this.loading = true;
			this.$store.subscribe((action) => {
				if (action.type === 'githubStore/SET_PR_DATA') {
					this.prs = this.$accessor.githubStore.prs;
				}
			});
			this.loading = false;
		},
		methods: {
			repoUrl(name: string) {
				return `https://github.com/${this.$auth.user?.login}/${name}`;
			},
		},
	});
</script>
<style lang="scss" scoped>
	.theme--light {
		.font-weight-light,
		a {
			color: black;
		}
	}

	.theme--dark {
		.font-weight-light,
		a {
			color: white;
		}
	}
</style>
