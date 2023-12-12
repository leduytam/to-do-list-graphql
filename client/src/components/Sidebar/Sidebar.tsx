import { Box, VStack } from '@chakra-ui/react';
import Account from './Account';
import ToDoLists from '../ToDoLists/ToDoLists';

const SideBar: React.FC = () => {
  return (
    <VStack w={'240px'} h={'full'}>
      <Box flexGrow={1} w={'full'}>
        <ToDoLists />
      </Box>
      <Account />
    </VStack>
  );
};

export default SideBar;
