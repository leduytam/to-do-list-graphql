import { gql } from '@apollo/client';

export const GET_TASKS_QUERY = gql`
  query GetTasksQuery($toDoListId: String!) {
    getTasks(toDoListId: $toDoListId) {
      id
      content
      isCompleted
      order
    }
  }
`;
