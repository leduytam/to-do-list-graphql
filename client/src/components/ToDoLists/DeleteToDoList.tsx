import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  IconButton,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React, { useRef } from 'react';
import { FaRegTrashCan } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { DELETE_TODO_LIST_MUTATION } from '../../graphql/toDoList/mutations';
import { GET_TODO_LISTS } from '../../graphql/toDoList/queries';
import { ApolloError, useMutation } from '@apollo/client';

type Props = {
  id: string;
};

const DeleteToDoList: React.FC<Props> = ({ id }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const navigate = useNavigate();
  const toast = useToast();

  const [deleteToDoListMutation] = useMutation<
    {
      deleteToDoList: {
        message: string;
      };
    },
    {
      id: string;
    }
  >(DELETE_TODO_LIST_MUTATION, {
    refetchQueries: [
      {
        query: GET_TODO_LISTS,
      },
    ],
  });

  const handleDelete = async () => {
    try {
      const response = await deleteToDoListMutation({
        variables: {
          id,
        },
      });

      toast({
        title: response.data?.deleteToDoList.message,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

      navigate('/');
    } catch (err) {
      if (err instanceof ApolloError) {
        toast({
          title: 'Error',
          description: err.message,
          status: 'error',
          isClosable: true,
        });
      } else {
        throw err;
      }
    }
  };

  return (
    <>
      <IconButton
        aria-label={'Delete to do list'}
        icon={<FaRegTrashCan />}
        onClick={onOpen}
      >
        Edit
      </IconButton>

      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Delete to do list?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to delete this to do list?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button colorScheme="red" ml={3} onClick={handleDelete}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteToDoList;
