# Github PR Navigator

This application allows a user with a GitHub account to manage Pull Requests across all their projects from one location.
The app can be found here — https://github-graphql-red.herokuapp.com/

## Setup for Local Development

1. Clone and open this repository in VS Code.
2. Install all recommended extensions when prompted.
3. Run `yarn install` to install all dependencies.
4. Run `yarn dev` to start the application dev server on port 3000.

## Unit Testing

### Run all tests

Run all unit tests in the project using the command

```
yarn test
```

### Run a single test

Run a single unit test file using the command:

```
yarn run test <test-file>
```

### Debug tests

To debug unit tests, select `jest: all tests` or `jest: current file` debug configuration from VS Code's Debug tab and press `F5`.

### Update Snapshots

To update all Jest snapshot files, run the following command:

```
yarn updateSnapshots
```

## End-to-End Testing

Check the `README.md` file available in the `./e2e` folder for information on E2E test setup.

## Formatting

Run the following command to run Prettier formatter:

```
yarn format
```

**Note:** Prettier formatter extension needs to be installed for this command to work.

## Linting

Run the following command to run ESLint linter and also fix minor errors:

```
yarn lint
```

**Note:** Enable the ESLint extension server for realtime linting.

## Compile and minify for production

1. Run `yarn build` to create a `./nuxt` folder with the compiled output.
2. Run `yarn start` to start a dev server for the compiled output on port 3000.
