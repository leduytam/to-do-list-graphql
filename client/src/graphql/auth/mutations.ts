import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation LogIn($user: LoginInput!) {
    logIn(user: $user) {
      accessToken
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($user: RegisterInput!) {
    register(user: $user) {
      message
    }
  }
`;

export const REFRESH_MUTATION = gql`
  mutation Refresh($token: String!) {
    refresh(token: $token) {
      accessToken
    }
  }
`;
