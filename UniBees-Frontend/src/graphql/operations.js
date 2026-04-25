import { gql } from '@apollo/client';

// --- QUERIES ---
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

// --- MUTATIONS ---
export const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $email: String!, $password: String!, $name: String!, $major: String!) {
    signup(username: $username, email: $email, password: $password, name: $name, major: $major)
  }
`;


export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user { id username rank }
    }
  }
`;

export const UPDATE_INTERESTS_MUTATION = gql`
  mutation UpdateInterests($interests: [String!]!) {
    updateInterests(interests: $interests) {
      id
      interests
    }
  }
`;

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($newPassword: String!) {
    changePassword(newPassword: $newPassword)
  }
`;