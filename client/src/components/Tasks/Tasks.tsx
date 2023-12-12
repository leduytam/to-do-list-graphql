import { useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { ITask } from '../../types/task.interface';
import { GET_TASKS_QUERY } from '../../graphql/task/queries';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import { REARRANGE_TASKS_MUTATION } from '../../graphql/task/mutations';
import TaskItem from './TaskItem';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import NewTask from './NewTask';

type Props = {
  toDoListId?: string;
};

const reorder = (tasks: ITask[], startIndex: number, endIndex: number) => {
  const result = Array.from(tasks);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const Tasks: React.FC<Props> = ({ toDoListId }) => {
  const { data, loading, error } = useQuery<{
    getTasks: ITask[];
  }>(GET_TASKS_QUERY, {
    variables: {
      toDoListId,
    },
    skip: !toDoListId,
  });
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [rearrangeTasksMutation] = useMutation<
    { message: string },
    {
      input: {
        toDoListId: string;
        tasks: {
          id: string;
          order: number;
        }[];
      };
    }
  >(REARRANGE_TASKS_MUTATION, {
    refetchQueries: [
      {
        query: GET_TASKS_QUERY,
        variables: {
          toDoListId,
        },
      },
    ],
  });

  useEffect(() => {
    if (data) {
      setTasks(data.getTasks.sort((a, b) => a.order - b.order));
    }
  }, [data]);

  if (loading) {
    return <Spinner size={'xl'} thickness={'6px'} />;
  }

  if (error) {
    return (
      <Alert status="error" w={'auto'}>
        <AlertIcon />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(tasks, result.source.index, result.destination.index);

    setTasks(items);

    const taskOrders = items.map((task, index) => ({
      id: task.id,
      order: index + 1,
    }));

    if (toDoListId) {
      rearrangeTasksMutation({
        variables: {
          input: {
            toDoListId,
            tasks: taskOrders,
          },
        },
      });
    }
  };

  return (
    <VStack w={'full'} gap={0}>
      <NewTask toDoListId={toDoListId} />

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <Box
              display={'flex'}
              flexDirection={'column'}
              w={'full'}
              p={2}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {tasks.map((task, index) => (
                <TaskItem
                  key={task.id}
                  index={index}
                  item={task}
                  toDoListId={toDoListId!}
                />
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </VStack>
  );
};

export default Tasks;
