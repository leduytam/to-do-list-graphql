import { Box, Divider, HStack } from '@chakra-ui/react';
import SideBar from '../components/Sidebar/Sidebar';
import { useParams } from 'react-router-dom';
import ToDoListDetail from '../components/ToDoLists/ToDoListDetail';

const Dashboard: React.FC = () => {
  const { id } = useParams();

  return (
    <HStack h={'100vh'} alignItems={'flex-start'} gap={0}>
      <SideBar />

      <Divider orientation="vertical" />

      <Box
        flexGrow={1}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        h={'full'}
        p={2}
      >
        {id && <ToDoListDetail id={id} />}
      </Box>
    </HStack>
  );
};

export default Dashboard;
