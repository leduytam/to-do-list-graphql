import { Spinner, VStack } from '@chakra-ui/react';
import NewToDoList from './NewToDoList';
import { IToDoList } from '../../types/toDoList.interface';
import { useQuery } from '@apollo/client';
import { GET_TODO_LISTS } from '../../graphql/toDoList/queries';
import ToDoListItem from './ToDoListItem';

const ToDoLists: React.FC = () => {
  const { data, loading, refetch } = useQuery<{
    getToDoLists: IToDoList[];
  }>(GET_TODO_LISTS);

  const handleCreateToDoList = () => {
    refetch();
  };

  if (loading) {
    return <Spinner size={'xl'} thickness={'6px'} />;
  }

  return (
    <VStack gap={4}>
      <NewToDoList onCreate={handleCreateToDoList} />

      <VStack w={'full'} h={'full'} overflowY={'auto'} spacing={2} px={2}>
        {data?.getToDoLists.map((toDoList) => (
          <ToDoListItem key={toDoList.id} toDoList={toDoList} />
        ))}
      </VStack>
    </VStack>
  );
};

export default ToDoLists;
