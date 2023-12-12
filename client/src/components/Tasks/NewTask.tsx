import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React from 'react';
import { FaPlus } from 'react-icons/fa6';
import { FormProvider, useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { ApolloError, useMutation } from '@apollo/client';
import Joi from 'joi';
import { CREATE_TASK_MUTATION } from '../../graphql/task/mutations';
import { GET_TASKS_QUERY } from '../../graphql/task/queries';

interface Props {
  toDoListId?: string;
}

interface INewTask {
  content: string;
}

const NewTaskSchema = Joi.object({
  content: Joi.string().required().messages({
    'string.empty': 'Content cannot be empty',
  }),
});

const NewTask: React.FC<Props> = ({ toDoListId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const method = useForm<INewTask>({
    resolver: joiResolver(NewTaskSchema),
  });

  const toast = useToast();

  const [createTaskMutation] = useMutation<{
    task: {
      content: string;
      toDoListId: string;
    };
  }>(CREATE_TASK_MUTATION, {
    refetchQueries: [
      {
        query: GET_TASKS_QUERY,
        variables: {
          toDoListId: toDoListId,
        },
      },
    ],
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = method;

  const onSubmit = async (data: INewTask) => {
    try {
      await createTaskMutation({
        variables: {
          task: {
            content: data.content,
            toDoListId: toDoListId,
          },
        },
      });

      toast({
        title: 'Success',
        description: 'Created successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

      onClose();

      reset();
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
      <Box w={'full'} p={2}>
        <Button
          leftIcon={<FaPlus />}
          w={'full'}
          fontSize={'14'}
          onClick={onOpen}
        >
          <Text>New Task</Text>
        </Button>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <FormProvider {...method}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader>Create new task</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl isRequired isInvalid={!!errors.content}>
                  <FormLabel fontSize={13} mb={1}>
                    Content
                  </FormLabel>
                  <Input
                    placeholder="Content"
                    {...register('content')}
                    autoFocus={true}
                  />
                  <FormErrorMessage>{errors.content?.message}</FormErrorMessage>
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button mr={3} onClick={onClose} fontSize={14}>
                  Cancel
                </Button>
                <Button type={'submit'} isLoading={isSubmitting} fontSize={14}>
                  Create
                </Button>
              </ModalFooter>
            </form>
          </FormProvider>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewTask;
