
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "src/gql/schema.graphql",
  documents: "src/**/*.tsx",
  generates: {
    "src/gql/__generated__/": {
      preset: "client",
      plugins: []
    }
  }
};

export default config;
