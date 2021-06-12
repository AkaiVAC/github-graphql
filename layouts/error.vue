<template>
    <v-container
        class="d-flex justify-center align-start align-md-center fill-height"
    >
        <v-row class="justify-center">
            <v-col cols="12" md="6">
                <v-card
                    flat
                    class="
                        d-flex
                        flex-column
                        justify-center
                        align-center
                        text-center
                    "
                >
                    <v-card-title class="primary-title">
                        <h1 class="text-h4 text-uppercase">
                            <v-icon color="error" left x-large>
                                {{ icons.mdiAlertOutline }}
                            </v-icon>
                            {{ error.statusCode }}
                            <v-icon color="error" right x-large>
                                {{ icons.mdiAlertOutline }}
                            </v-icon>
                        </h1>
                    </v-card-title>
                    <v-card-text class="text-h6 pb-0">
                        <p>{{ error.message }}</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn class="mb-3" color="warning" href="/">
                            <v-icon left>
                                {{ icons.mdiHomeExportOutline }}
                            </v-icon>
                            Go back home
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import { mdiHomeExportOutline, mdiAlertOutline } from '@mdi/js';
    export default {
        props: {
            error: {
                type: Object,
                default: null,
            },
        },
        data() {
            return {
                icons: { mdiHomeExportOutline, mdiAlertOutline },
            };
        },
        head() {
            const title =
                this.error.statusCode === 404 ? 'Page not found' : 'Error!';
            return {
                title,
            };
        },
    };
</script>

<style scoped>
    h1 {
        font-size: 20px;
    }
</style>
