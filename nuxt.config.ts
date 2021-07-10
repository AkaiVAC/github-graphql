import type { NuxtConfig } from '@nuxt/types';
import { NuxtOptionsVueConfiguration } from '@nuxt/types/config/vue-configuration';
import ESLintWebpackPlugin from 'eslint-webpack-plugin';

import colors from 'vuetify/es5/util/colors';

const config: NuxtConfig = {
	ssr: false,
	target: 'static',
	telemetry: false,

	head: {
		meta: [
			{ charset: 'utf-8' },
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			{
				hid: 'description',
				name: 'description',
				content:
					'This application enables creation of pupil ability groups',
			},
			{
				hid: 'theme-color',
				name: 'theme-color',
				content: '#000000',
			},
		],
	},

	css: [],

	components: true,

	publicRuntimeConfig: {
		token: process.env.GITHUB_TOKEN || '',
	},

	buildModules: [
		'@nuxt/typescript-build',
		'@nuxtjs/vuetify',
		'nuxt-typed-vuex',
	],

	modules: ['@nuxtjs/axios', '@nuxtjs/auth-next', '@nuxtjs/apollo'],

	router: {
		routeNameSplitter: '/',
		extendRoutes(routes, resolve) {
			routes.push({
				name: 'login',
				path: '/login',
				component: resolve(__dirname, 'pages/index.vue'),
			});
		},
	},

	apollo: {
		clientConfigs: {
			default: {
				httpEndpoint: 'https://api.github.com/graphql',
			},
		},
	},

	vuetify: {
		customVariables: ['~/assets/scss/variables.scss'],
		options: { customProperties: true },
		defaultAssets: false,
		treeShake: true,
		icons: {
			iconfont: 'mdiSvg',
		},
		theme: {
			dark: false,
			themes: {
				dark: {
					primary: colors.deepPurple.darken3,
					accent: colors.grey.darken3,
					secondary: colors.amber.darken4,
					info: colors.blue.darken3,
					warning: colors.orange.darken3,
					error: colors.red.accent4,
					success: colors.green.darken3,
				},
				light: {
					primary: colors.deepPurple.darken3,
					accent: colors.grey.darken3,
					secondary: colors.amber.darken4,
					info: colors.blue.darken3,
					warning: colors.orange.darken3,
					error: colors.red.accent4,
					success: colors.green.darken3,
				},
			},
		},
	},

	auth: {
		strategies: {
			github: {
				clientId: process.env.CLIENT_ID,
				clientSecret: process.env.CLIENT_SECRET,
			},
		},
		cookie: {
			options: {
				secure: true,
			},
		},
	},
	vue: {
		config: {
			devtools: false,
			productionTip: false,
		} as NuxtOptionsVueConfiguration,
	},

	build: {
		analyze: false,
		babel: {
			presets() {
				return [
					[
						'@nuxt/babel-preset-app',
						{
							useBuiltIns: 'entry',
						},
					],
				];
			},
		},
		hotMiddleware: {
			client: {
				overlay: false,
			},
		},
		extend(config, ctx) {
			// To debug with VS Code
			if (ctx.isDev) {
				config.devtool = ctx.isClient
					? 'source-map'
					: 'inline-source-map';
			}
		},
		plugins: [new ESLintWebpackPlugin()],
	},
	generate: {
		fallback: '404.html',
	},
};

export default config;
