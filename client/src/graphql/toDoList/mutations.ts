import { gql } from '@apollo/client';

export const CREATE_TODO_LIST_MUTATION = gql`
  mutation CreateToDoListMutation($toDoList: CreateToDoListInput!) {
    createToDoList(toDoList: $toDoList) {
      id
      name
      description
    }
  }
`;

export const UPDATE_TODO_LIST_MUTATION = gql`
  mutation UpdateToDoListMutation($toDoList: UpdateToDoListInput!) {
    updateToDoList(toDoList: $toDoList) {
      message
    }
  }
`;

export const DELETE_TODO_LIST_MUTATION = gql`
  mutation DeleteToDoListMutation($id: String!) {
    deleteToDoList(id: $id) {
      message
    }
  }
`;
