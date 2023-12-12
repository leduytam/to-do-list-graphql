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
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React from 'react';
import { FaPlus } from 'react-icons/fa6';
import { IToDoList } from '../../types/toDoList.interface';
import Joi from 'joi';
import { FormProvider, useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { ApolloError, useMutation } from '@apollo/client';
import { CREATE_TODO_LIST_MUTATION } from '../../graphql/toDoList/mutations';
import { useNavigate } from 'react-router-dom';

type Props = {
  onCreate: () => void;
};

interface INewToDoList {
  name: string;
  description: string;
}

const NewToDoListSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Name cannot be empty',
  }),
  description: Joi.string().allow(''),
});

const NewToDoList: React.FC<Props> = ({ onCreate }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const method = useForm<INewToDoList>({
    resolver: joiResolver(NewToDoListSchema),
  });

  const toast = useToast();
  const navigate = useNavigate();

  const [createToDoListMutation] = useMutation<{
    createToDoList: IToDoList;
  }>(CREATE_TODO_LIST_MUTATION);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = method;

  const onSubmit = async (data: INewToDoList) => {
    try {
      const response = await createToDoListMutation({
        variables: {
          toDoList: {
            name: data.name,
            description: data.description,
          },
        },
      });

      const id = response.data?.createToDoList.id;

      onCreate();

      toast({
        title: 'Success',
        description: 'Created successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

      onClose();

      reset();

      if (id) {
        navigate(`/${id}`);
      }
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
          <Text>New List</Text>
        </Button>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <FormProvider {...method}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader>Create new list</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl isRequired isInvalid={!!errors.name}>
                  <FormLabel fontSize={13} mb={1}>
                    Name
                  </FormLabel>
                  <Input
                    placeholder="Name"
                    {...register('name')}
                    autoFocus={true}
                  />
                  <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                </FormControl>

                <FormControl mt={4} isInvalid={!!errors.description}>
                  <FormLabel fontSize={13} mb={1}>
                    Description
                  </FormLabel>
                  <Textarea
                    placeholder="Description"
                    {...register('description')}
                  />
                  <FormErrorMessage>
                    {errors.description?.message}
                  </FormErrorMessage>
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

export default NewToDoList;
