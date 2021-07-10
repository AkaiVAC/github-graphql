<template>
	<v-container class="fill-height">
		<v-row class="justify-start" v-if="$auth.loggedIn">
			<v-col cols="12" sm="4" md="5" lg="4"><ProjectList /></v-col>
			<v-col cols="12" sm="8" md="7" lg="8"><PRListContainer /></v-col>
		</v-row>
		<v-row class="justify-start" v-else>
			<v-col cols="12">
				<div
					class="
						fill-height
						d-flex
						flex-column
						justify-center
						align-center
					"
				>
					<v-icon size="80" class="mb-4">{{
						icons.mdiGithub
					}}</v-icon>
					<h3>Login to View Projects</h3>
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>
<script lang="ts">
	import Vue from 'vue';
	import { mdiGithub } from '@mdi/js';
	export default Vue.extend({
		data: () => ({
			icons: { mdiGithub },
		}),
	});
</script>
<style lang="scss" scoped>
	.pr_list {
		max-width: 35vmin;
	}
</style>
