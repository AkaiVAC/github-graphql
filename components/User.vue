<template>
	<v-menu
		offset-y
		nudge-width="200"
		:close-on-content-click="false"
		transition="scale-transition"
		origin="top center"
	>
		<template #activator="{ on, attrs }" v-if="$auth.loggedIn">
			<v-btn
				class="user_info header_btn"
				text
				v-if="$auth.loggedIn"
				v-on="on"
				v-bind="attrs"
			>
				<v-avatar left class="mr-3" size="28">
					<img
						:src="$auth.user.avatar_url"
						alt="User's profile picture"
					/>
				</v-avatar>
				{{ $auth.user.login }}
			</v-btn>
		</template>
		<v-card max-width="400">
			<v-list>
				<v-list-item>
					<v-list-item-avatar size="80">
						<img
							:src="$auth.user.avatar_url"
							alt="User's profile image"
						/>
					</v-list-item-avatar>
					<v-list-item-content>
						<v-list-item-title
							class="text--h6 font-weight-bold ml-3 mb-1"
							>{{ $auth.user.login }}</v-list-item-title
						>
						<v-list-item-subtitle>
							<v-chip
								label
								:outlined="false"
								class="transparent"
								small
								@click="copyText($auth.user.id)"
							>
								<span class="font-weight-bold">ID:&nbsp;</span>
								{{ $auth.user.id }}
								<v-icon x-small right>{{
									icons.mdiClipboardOutline
								}}</v-icon>
							</v-chip>
						</v-list-item-subtitle>
						<v-list-item-subtitle>
							<v-chip
								label
								:outlined="false"
								class="transparent"
								small
								@click="copyText($auth.user.node_id)"
							>
								<span class="font-weight-bold"
									>Node ID:&nbsp;</span
								>
								{{ $auth.user.node_id }}
								<v-icon x-small right>{{
									icons.mdiClipboardOutline
								}}</v-icon>
							</v-chip>
						</v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>
			</v-list>
			<v-divider></v-divider>
			<v-list>
				<v-list-item>
					<v-chip-group column>
						<v-chip
							:href="repoUrl('?tab=repositories')"
							target="_blank"
						>
							repos: {{ $auth.user.public_repos }}
							<v-icon right small>
								{{ icons.mdiOpenInNew }}
							</v-icon>
						</v-chip>
						<v-chip
							:href="repoUrl('?tab=followers')"
							target="_blank"
						>
							followers: {{ $auth.user.followers }}
							<v-icon right small>
								{{ icons.mdiOpenInNew }}
							</v-icon>
						</v-chip>
						<v-chip
							:href="repoUrl('?tab=following')"
							target="_blank"
						>
							following: {{ $auth.user.following }}
							<v-icon right small>
								{{ icons.mdiOpenInNew }}
							</v-icon>
						</v-chip>
					</v-chip-group>
				</v-list-item>
			</v-list>
		</v-card>
		<v-snackbar absolute bottom right v-model="snackbar" timeout="1000">
			Copied
		</v-snackbar>
	</v-menu>
</template>
<script lang="ts">
	import Vue from 'vue';
	import { mdiOpenInNew, mdiClipboardOutline } from '@mdi/js';
	export default Vue.extend({
		data: () => ({
			icons: { mdiOpenInNew, mdiClipboardOutline },
			overlay: false,
			hover: false,
			snackbar: false,
			active: false,
		}),
		methods: {
			repoUrl(location: string = ''): string {
				return `https://github.com/${
					this.$auth?.user?.login ?? ''
				}${location}`;
			},
			async copyText(text: string): Promise<void> {
				await navigator.clipboard.writeText(text);
				this.snackbar = true;
			},
		},
	});
</script>
