module.exports = {
  src: './',
  language: 'typescript',
  artifactDirectory: './__generated__',
  customScalars: {
    Datetime: 'String'
  },
  exclude: [
    '**/.next/**',
    '**/node_modules/**',
    '**/__generated__/**',
    '**/server/**'
  ],
  schema: './server/schema.graphql',
  noFutureProofEnums: true
};