const {GraphQLClient} = require('graphql-request');
// graphgl-request 3.1.0 workaround
// https://github.com/prisma-labs/graphql-request/issues/206
const { Headers } = require('cross-fetch');

global.Headers = global.Headers || Headers;

const config = require('../config');


exports.searchRepositories = async (queryString) => {

  const endpoint = 'https://api.github.com/graphql';
  
  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      Authorization: `Bearer ${config.githubToken}`
    }
  });

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

  const varibale = {
    queryString: queryString
  };
  
  const response = await graphQLClient.request(query, varibale);
  return response;
};

exports.getContributors = async () => {};