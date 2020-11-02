const { GraphQLClient } = require('graphql-request');
// graphgl-request 3.1.0 workaround
// https://github.com/prisma-labs/graphql-request/issues/206
const { Headers } = require('cross-fetch');

global.Headers = global.Headers || Headers;
// End of workaround

const config = require('../config');

const endpoint = 'https://api.github.com/graphql';

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    Authorization: `Bearer ${config.githubToken}`,
  },
});

exports.searchRepositories = async (params) => {
  const { queryString, first = 5 } = params;

  if (!params.queryString) {
    throw Error('queryString is a mandatory parameter');
  }

  const query = `query search($queryString:String!, $first:Int){ 
    search(query: $queryString, type: REPOSITORY, first: $first) {
      repositoryCount
      edges {
        node {
        ... on Repository {
          name
          description
          homepageUrl
          stargazerCount
          languages(first: 1) {
            edges {
              node {
                name
              }
            }
          }
          createdAt
          owner {
            id
            login
            avatarUrl
            url
          }
        }
      }
    }}
  }`;

  const varibale = { queryString, first };

  const response = await graphQLClient.request(query, varibale);
  return response;
};

exports.getContributors = async (owner, repoName) => {
  const query = `query collaboratorsQuery($owner:String!,$repoName:String!){
    repository(owner: $owner, name: $repoName) {
      collaborators(first:10) {
        edges {
          node {
            id
            login
            url
            avatarUrl
          }
        }
      }
    }
  }`;

  const varibale = { owner, repoName };

  const response = await graphQLClient.request(query, varibale);
  return response;
};
