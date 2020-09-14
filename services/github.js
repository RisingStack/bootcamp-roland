const {GraphQLClient} = require('graphql-request');
// graphgl-request 3.1.0 workaround
// https://github.com/prisma-labs/graphql-request/issues/206
const { Headers } = require('cross-fetch');
global.Headers = global.Headers || Headers;
// End of workaround

const config = require('../config');
const endpoint = 'https://api.github.com/graphql';

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    Authorization: `Bearer ${config.githubToken}`
  }
});

exports.searchRepositories = async (queryString) => {

  const query = `query search($queryString:String!){ 
    search(query: $queryString, type: REPOSITORY, first: 10) {
      repositoryCount
      edges {
        node {
        ... on RepositoryInfo {
          name
          createdAt
          owner {
            id
            login
          }
        }
      }
    }
    }
  }`;

  const varibale = {queryString};
  
  const response = await graphQLClient.request(query, varibale);
  return response;
};

exports.getContributors = async (owner, repoName) => {

  const query = `query collaboratorsQuery($owner:String!, $repoName:String!){
    repository(owner: $owner, name: $name) {
      collaborators(first:100, affiliation: DIRECT) {
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

  const varibale = {owner, repoName};
  
  const response = await graphQLClient.request(query, varibale);
  return response;
};