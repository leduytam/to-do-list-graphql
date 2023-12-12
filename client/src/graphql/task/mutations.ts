import { gql } from '@apollo/client';

export const CREATE_TASK_MUTATION = gql`
  mutation CreateTask($task: CreateTaskInput!) {
    createTask(task: $task) {
      id
      content
      isCompleted
      order
    }
  }
`;

export const UPDATE_TASK_MUTATION = gql`
  mutation UpdateTask($task: UpdateTaskInput!) {
    updateTask(task: $task) {
      message
    }
  }
`;

export const REARRANGE_TASKS_MUTATION = gql`
  mutation RearrangeTasks($input: RearrangeTasksInput!) {
    rearrangeTasks(input: $input) {
      message
    }
  }
`;

export const DELETE_TASK_MUTATION = gql`
  mutation DeleteTask($id: String!) {
    deleteTask(id: $id) {
      message
    }
  }
`;
