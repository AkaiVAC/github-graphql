<template>
	<v-app-bar color="black" dark app clipped-left>
		<v-toolbar-title class="mx-auto">
			<a href="/" class="white--text">
				<v-icon left large>{{ icons.mdiGithub }}</v-icon>
				GitHub Pull Request Navigator
			</a>
		</v-toolbar-title>
		<v-spacer></v-spacer>
		<User />
		<Auth class="ml-2" />
	</v-app-bar>
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
<style lang="scss">
	.header_btn {
		text-transform: none;
	}
	a {
		text-decoration: none;
	}
</style>
