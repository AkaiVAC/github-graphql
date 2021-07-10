<template>
	<div class="auth">
		<v-btn
			class="header_btn"
			text
			v-if="!$auth.loggedIn"
			@click="$auth.loginWith('github')"
		>
			Sign In
		</v-btn>
		<v-btn class="header_btn" text v-else @click="$auth.logout()">
			Sign Out
		</v-btn>
	</div>
</template>
