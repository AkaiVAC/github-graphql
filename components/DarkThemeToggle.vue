<template>
	<v-btn
		class="dark-theme-toggle"
		:icon="icon"
		fab
		:depressed="depressed"
		@click="toggleDarkMode"
		aria-label="dark mode toggle button"
	>
		<v-icon>{{ icons.mdiBrightness4 }}</v-icon>
	</v-btn>
</template>
<script lang="ts">
	import Vue from 'vue';
	import { mdiBrightness4 } from '@mdi/js';
	export default Vue.extend({
		data() {
			return {
				icons: { mdiBrightness4 },
			};
		},
		props: {
			icon: {
				required: false,
				type: Boolean,
			},
			depressed: {
				required: false,
				type: Boolean,
			},
		},
		methods: {
			toggleDarkMode(): void {
				this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
				localStorage.setItem(
					'darkTheme',
					String(this.$vuetify.theme.dark),
				);
			},
		},
	});
</script>
<style lang="scss" scoped>
	.theme--light.v-btn.v-btn--icon {
		color: black;
	}

	.dark-theme-toggle {
		position: fixed;
		bottom: 0;
		right: 0;
		margin: 1rem;
	}
</style>
