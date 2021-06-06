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
      <h2 class="font-weight-light">{{ prs.name }}</h2>
      <v-list three-line>
        <template v-for="(pr, index) in prs.pullRequests.nodes">
          <v-list-item :key="pr.id">
            <a :href="pr.url" target="_blank" title="Open PR in a new tab">
              <v-list-item-avatar size="60">
                <v-img :src="pr.author.avatarUrl"></v-img>
              </v-list-item-avatar>
            </a>
            <v-list-item-content>
              <v-list-item-title class="d-flex flex-wrap">
                {{ pr.title }}&nbsp;
                <v-chip
                  class="ml-1"
                  small
                  :href="pr.author.url"
                  target="_blank"
                >
                  {{ pr.author.login }}
                  <v-icon right small>{{ icons.mdiOpenInNew }}</v-icon>
                </v-chip>
              </v-list-item-title>
              <v-list-item-subtitle class="d-flex flex-wrap">
                <v-chip label small class="mr-2 transparent">
                  #PR:&nbsp;{{ pr.number }}
                </v-chip>
                <v-chip label small class="mr-2 transparent">
                  Files changed:&nbsp;
                  {{ pr.potentialMergeCommit.changedFiles }}
                </v-chip>
                <v-chip
                  label
                  small
                  link
                  class="mr-2 success"
                  @click.stop="doIt()"
                >
                  Merge
                </v-chip>
                <v-chip
                  label
                  small
                  link
                  class="mr-2 error"
                  @click.stop="doIt()"
                >
                  Close
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider :key="index" inset></v-divider>
        </template>
      </v-list>
    </v-card-text>
  </v-card>
</template>
<script lang="ts">
  import Vue from 'vue';
  import { mdiGithub, mdiOpenInNew } from '@mdi/js';
  export default Vue.extend({
    data: () => ({
      icons: { mdiGithub, mdiOpenInNew },
      prs: {} as GitHubStore.Project_PR_Data,
      loading: false,
      snackbar: false,
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
      async copyText(text: string): Promise<void> {
        await navigator.clipboard.writeText(text);
        this.snackbar = true;
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
