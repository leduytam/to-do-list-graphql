import React, { useEffect, useState } from 'react';
import { IToDoList, IToDoListDetails } from '../../types/toDoList.interface';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import {
  GET_TODO_LISTS,
  GET_TODO_LIST_DETAILS,
} from '../../graphql/toDoList/queries';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  IconButton,
  Input,
  Spinner,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { FormProvider, useForm } from 'react-hook-form';
import Joi from 'joi';
import { joiResolver } from '@hookform/resolvers/joi';
import { FaPencil } from 'react-icons/fa6';
import { UPDATE_TODO_LIST_MUTATION } from '../../graphql/toDoList/mutations';
import DeleteToDoList from './DeleteToDoList';
import Tasks from '../Tasks/Tasks';

type Props = {
  id: string;
};

interface IEditToDoList {
  name: string;
  description: string;
}

const EditToDoListSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Name cannot be empty',
  }),
  description: Joi.string().allow(''),
});

const ToDoListDetail: React.FC<Props> = ({ id }) => {
  const { data, loading, error } = useQuery<{
    getToDoList: IToDoListDetails;
  }>(GET_TODO_LIST_DETAILS, {
    variables: {
      id,
    },
  });

  const [updateToDoListMutation] = useMutation<
    {
      updateToDoList: {
        message: string;
      };
    },
    {
      toDoList: IToDoList;
    }
  >(UPDATE_TODO_LIST_MUTATION, {
    refetchQueries: [
      {
        query: GET_TODO_LISTS,
      },
    ],
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const toast = useToast();

  const method = useForm<IEditToDoList>({
    resolver: joiResolver(EditToDoListSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = method;

  useEffect(() => {
    reset({
      name: data?.getToDoList.name,
      description: data?.getToDoList.description,
    });
  }, [data, reset]);

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

  const onSubmit = async (data: IEditToDoList) => {
    try {
      const response = await updateToDoListMutation({
        variables: {
          toDoList: {
            id,
            name: data.name,
            description: data.description,
          },
        },
      });

      toast({
        title: 'Success',
        description: response.data?.updateToDoList.message || '',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
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
    } finally {
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <Container h={'full'}>
      <FormProvider {...method}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={!!errors.name}>
            <FormLabel fontSize={13} mb={1}>
              Name
            </FormLabel>
            <Input
              placeholder="Name"
              {...register('name')}
              autoFocus={true}
              readOnly={!isEditing}
            />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>

          <FormControl mt={4} isInvalid={!!errors.description}>
            <FormLabel fontSize={13} mb={1}>
              Description
            </FormLabel>
            <Textarea
              placeholder="Description"
              resize={'none'}
              height={'auto'}
              rows={6}
              {...register('description')}
              readOnly={!isEditing}
            />
            <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
          </FormControl>

          <HStack mt={3} justifyContent={'flex-end'}>
            {!isEditing ? (
              <>
                <IconButton
                  aria-label={'Enable edit to do list'}
                  icon={<FaPencil />}
                  onClick={handleEdit}
                >
                  Edit
                </IconButton>
                <DeleteToDoList id={id} />
              </>
            ) : (
              <>
                <Button onClick={handleCancel}>Cancel</Button>

                <Button type={'submit'} isLoading={isSubmitting}>
                  Save
                </Button>
              </>
            )}
          </HStack>
        </form>
      </FormProvider>

      <VStack mt={6}>
        <Heading size={'md'}>Tasks</Heading>

        <Tasks toDoListId={data?.getToDoList.id} />
      </VStack>
    </Container>
  );
};

export default ToDoListDetail;
