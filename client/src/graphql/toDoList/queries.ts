import { gql } from '@apollo/client';

export const GET_TODO_LISTS = gql`
  query GetToDoLists {
    getToDoLists {
      id
      name
      description
    }
  }
`;

export const GET_TODO_LIST_DETAILS = gql`
  query GetToDoListDetails($id: String!) {
    getToDoList(id: $id) {
      id
      name
      description
      tasks {
        id
        content
        isCompleted
        order
      }
    }
  }
`;
