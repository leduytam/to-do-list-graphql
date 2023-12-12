import { useQuery } from '@apollo/client';
import { GET_ME_QUERY } from '../../graphql/auth/queries';
import { IUser } from '../../types/user.interface';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Box,
  Button,
  HStack,
  SkeletonCircle,
  SkeletonText,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { FaArrowRightFromBracket } from 'react-icons/fa6';
import { useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Account: React.FC = () => {
  const { data, loading } = useQuery<{
    me: IUser;
  }>(GET_ME_QUERY);

  const { logOut } = useAuth();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const navigate = useNavigate();

  if (loading) {
    return (
      <HStack w={'100%'} m={2}>
        <SkeletonCircle size="12" />
        <SkeletonText
          noOfLines={2}
          spacing="2"
          skeletonHeight="2"
          width={'120px'}
        />
      </HStack>
    );
  }

  const handleLogOut = async () => {
    await logOut();
    navigate('/login');
  };

  return (
    <>
      <Box
        w={'100%'}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <HStack gap={'2'} m={2}>
          <Avatar name={data?.me.name} size={'md'} />
          <VStack gap={0} alignItems={'flex-start'}>
            <Text fontSize={'md'}>{data?.me.name}</Text>
            <Text fontSize={'sm'}>{data?.me.username}</Text>
          </VStack>
        </HStack>

        <Button variant={'ghost'} px="1" onClick={onOpen}>
          <FaArrowRightFromBracket />
        </Button>
      </Box>

      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Log out?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>Are you sure you want to log out?</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button colorScheme="red" ml={3} onClick={handleLogOut}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Account;
