import { gql } from '@apollo/client';

/**
 * These are the "Orders" your React app sends to the Python "Chef".
 * We use the 'gql' tag to turn these strings into actual queries.
 */

// --- MUTATIONS (Writing Data) ---

export const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $email: String!, $password: String!, $name: String!) {
    signup(username: $username, email: $email, password: $password, name: $name) {
      token
      user {
        id
        username
        email
        rank
        image
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        rank
      }
    }
  }
`;

// --- QUERIES (Reading Data) ---

export const GET_ME_QUERY = gql`
  query GetMe {
    me {
      id
      username
      email
      name
      major
      rank
      interests
      image
    }
  }
`;

export const GET_USER_PROFILE = gql`
  query GetUser($id: String!) {
    getUser(id: $id) {
      username
      name
      major
      rank
      interests
      image
    }
  }
`;