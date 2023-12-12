import React, { useState } from 'react';
import { ITask } from '../../types/task.interface';
import { Draggable } from 'react-beautiful-dnd';
import {
  Card,
  CardBody,
  HStack,
  IconButton,
  Radio,
  Text,
} from '@chakra-ui/react';
import { FaRegTrashCan } from 'react-icons/fa6';
import {
  DELETE_TASK_MUTATION,
  UPDATE_TASK_MUTATION,
} from '../../graphql/task/mutations';
import { useMutation } from '@apollo/client';
import { GET_TASKS_QUERY } from '../../graphql/task/queries';

type Props = {
  item: ITask;
  index: number;
  toDoListId: string;
};

const TaskItem: React.FC<Props> = ({ item, toDoListId, index }) => {
  const [deleteTaskMutation] = useMutation<{ message: string }, { id: string }>(
    DELETE_TASK_MUTATION,
    {
      refetchQueries: [
        {
          query: GET_TASKS_QUERY,
          variables: {
            toDoListId,
          },
        },
      ],
    },
  );

  const [updateTaskMutation] = useMutation<
    { message: string },
    { task: Pick<ITask, 'id' | 'content' | 'isCompleted'> }
  >(UPDATE_TASK_MUTATION, {
    refetchQueries: [
      {
        query: GET_TASKS_QUERY,
        variables: {
          toDoListId,
        },
      },
    ],
  });

  const [task, setTask] = useState<ITask>(item);

  const handleDelete = async () => {
    await deleteTaskMutation({
      variables: {
        id: task.id,
      },
    });
  };

  const handleToggleComplete = () => {
    setTask((prev) => ({
      ...prev,
      isCompleted: !prev.isCompleted,
    }));

    updateTaskMutation({
      variables: {
        task: {
          id: task.id,
          content: task.content,
          isCompleted: !task.isCompleted,
        },
      },
    });
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <Card
          width={'full'}
          mt={2}
          opacity={task.isCompleted ? 0.5 : 1}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <CardBody justifyContent={'flex-end'} py={'12px'}>
            <HStack>
              <HStack gap={3} flex={1}>
                <Radio
                  size={'lg'}
                  colorScheme={'green'}
                  isChecked={task.isCompleted}
                  onClick={handleToggleComplete}
                />
                <Text
                  noOfLines={1}
                  decoration={task.isCompleted ? 'line-through' : 'none'}
                >
                  {task.content}
                </Text>
              </HStack>

              <IconButton
                aria-label={'Delete task button'}
                variant={'ghost'}
                onClick={handleDelete}
                icon={<FaRegTrashCan />}
              />
            </HStack>
          </CardBody>
        </Card>
      )}
    </Draggable>
  );
};

export default TaskItem;
