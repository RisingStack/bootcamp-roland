const {GraphQLClient, gql} = require('graphql-request');
// graphgl-request 3.1.0 workaround
// https://github.com/prisma-labs/graphql-request/issues/206
const { Headers } = require('cross-fetch');

global.Headers = global.Headers || Headers;


exports.searchRepositories = async (queryString) => {

  const endpoint = 'https://api.github.com/graphql';
  
  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      Authorization: 'Bearer e29e30723a393a0bba480cda7e4e7cd4b17b3d21'
    }
  });

  const query = gql`{ 
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