<template>
    <v-list three-line>
        <template v-for="pr in prs.pullRequests.nodes">
            <v-card :key="pr.id" outlined class="mb-2">
                <v-list-item :key="pr.id">
                    <a
                        :href="pr.author.url"
                        target="_blank"
                        title="Open author's URL"
                    >
                        <v-list-item-avatar size="60">
                            <v-img :src="pr.author.avatarUrl"></v-img>
                        </v-list-item-avatar>
                    </a>
                    <v-list-item-content>
                        <v-list-item-title class="d-flex flex-wrap mb-2">
                            <v-chip
                                link
                                label
                                class="transparent"
                                :href="pr.url"
                                target="_blank"
                                title="Open PR in a new tab"
                            >
                                <h3>{{ pr.title }}</h3>
                                &nbsp;
                                <v-icon small>{{ icons.mdiOpenInNew }}</v-icon>
                            </v-chip>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <v-chip
                                small
                                label
                                @click="copyText(pr.id)"
                                class="transparent"
                                >ID:&nbsp;{{ pr.id }}
                                <v-icon right small>{{
                                    icons.mdiClipboardOutline
                                }}</v-icon>
                            </v-chip>
                        </v-list-item-subtitle>
                        <v-list-item-subtitle class="d-flex flex-wrap">
                            <v-chip-group column>
                                <v-chip label small class="mr-2 transparent">
                                    #PR:&nbsp;{{ pr.number }}
                                </v-chip>
                                <v-chip label small class="mr-2 transparent">
                                    Files changed:&nbsp;
                                    {{ filesChanged(pr) }}
                                </v-chip>
                                <div>
                                    <v-chip
                                        label
                                        small
                                        link
                                        class="mr-2 success"
                                        @click.stop="mergePR(pr.id)"
                                    >
                                        Merge
                                    </v-chip>
                                    <v-chip
                                        label
                                        small
                                        link
                                        class="mr-2 error"
                                        @click.stop="
                                            $accessor.githubStore.CLOSE_PR(
                                                pr.id
                                            )
                                        "
                                    >
                                        Close
                                    </v-chip>
                                </div>
                            </v-chip-group>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-card>
        </template>
        <v-snackbar
            absolute
            bottom
            right
            v-model="snackbar.show"
            :color="snackbar.color"
            timeout="1000"
        >
            {{ snackbar.text }}
        </v-snackbar>
    </v-list>
</template>
<script lang="ts">
    import Vue from 'vue';
    import { mdiOpenInNew, mdiClipboardOutline } from '@mdi/js';
    export default Vue.extend({
        data: () => ({
            icons: { mdiOpenInNew, mdiClipboardOutline },
            snackbar: {
                show: false,
                text: '',
                color: 'primary',
            },
        }),
        props: {
            prs: {
                required: true,
                type: Object,
            },
        },
        methods: {
            async copyText(text: string): Promise<void> {
                await navigator.clipboard.writeText(text);
                this.snackbar = {
                    text: `Copied!`,
                    color: 'primary',
                    show: true,
                };
            },
            async mergePR(ID: string): Promise<void> {
                await this.$accessor.githubStore.MERGE_PR(ID);
                this.snackbar = {
                    text: 'PR Merged',
                    color: 'success',
                    show: true,
                };
            },
            async closePR(ID: string): Promise<void> {
                await this.$accessor.githubStore.CLOSE_PR(ID);
                this.snackbar = {
                    text: 'PR Closed',
                    color: 'error',
                    show: true,
                };
            },
            repoUrl(name: string) {
                return `https://github.com/${this.$auth.user?.login}/${name}`;
            },
            filesChanged(pr: {
                potentialMergeCommit: { changedFiles: number };
            }): number {
                return pr.potentialMergeCommit?.changedFiles || 0;
            },
        },
    });
</script>
<style lang="scss" scoped>
    .theme--light {
        a {
            color: black;
        }
    }
    .theme--dark {
        a {
            color: white;
        }
    }
    a {
        &:hover {
            .v-avatar {
                filter: brightness(0.7);
                transition: 0.2s;
            }
        }
    }
    .v-list {
        max-height: 80vh;
        overflow-y: auto;
    }
</style>
