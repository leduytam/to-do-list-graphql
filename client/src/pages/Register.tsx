import { FormProvider, useForm } from 'react-hook-form';
import Joi from 'joi';
import { joiResolver } from '@hookform/resolvers/joi';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  useToast,
  Container,
  Heading,
  VStack,
  Text,
} from '@chakra-ui/react';
import { ApolloError, useMutation } from '@apollo/client';
import { REGISTER_MUTATION } from '../graphql/auth/mutations';
import { useNavigate } from 'react-router-dom';
import { Link as ReactRouterLink } from 'react-router-dom';
import { Link as ChakraLink } from '@chakra-ui/react';

const LoginSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.empty': 'Username cannot be empty',
  }),
  password: Joi.string()
    .required()
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .messages({
      'string.empty': 'Password cannot be empty',
      'string.pattern.base':
        'Password must contain at least 8 characters, one letter, one number and one special character',
    }),
  name: Joi.string().required().messages({
    'string.empty': 'Name cannot be empty',
  }),
});

interface IRegisterSchema {
  username: string;
  password: string;
  name: string;
}

const Register: React.FC = () => {
  const method = useForm<IRegisterSchema>({
    resolver: joiResolver(LoginSchema),
  });

  const [registerMutation] = useMutation<
    {
      message: string;
    },
    {
      user: {
        username: string;
        password: string;
        name: string;
      };
    }
  >(REGISTER_MUTATION);

  const toast = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = method;

  const onSubmit = async (data: IRegisterSchema) => {
    try {
      await registerMutation({
        variables: {
          user: {
            username: data.username,
            password: data.password,
            name: data.name,
          },
        },
      });

      navigate('/login');

      toast({
        title: 'Account created',
        description: 'You can now login',
        status: 'success',
        isClosable: true,
      });
    } catch (err) {
      if (err instanceof ApolloError) {
        toast({
          title: 'Register failed',
          description: err?.message,
          status: 'error',
          isClosable: true,
        });
      } else {
        throw err;
      }
    }
  };

  return (
    <Container
      h={'100vh'}
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Box p={4} w={'full'}>
        <Heading as="h1" size="lg" mb={4} textAlign={'center'}>
          Register
        </Heading>

        <FormProvider {...method}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack gap={4}>
              <FormControl isRequired isInvalid={!!errors.username}>
                <FormLabel mb={1} htmlFor="username">
                  Username
                </FormLabel>
                <Input
                  id="username"
                  placeholder="Username"
                  {...register('username')}
                />
                <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.password}>
                <FormLabel mb={1} htmlFor="password">
                  Password
                </FormLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  {...register('password')}
                />
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.name}>
                <FormLabel mb={1} htmlFor="name">
                  Name
                </FormLabel>
                <Input id="name" placeholder="Name" {...register('name')} />
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
              </FormControl>

              <Button mt={4} w={'full'} type="submit" isLoading={isSubmitting}>
                Register
              </Button>
              <Text>
                Already have an account?{' '}
                <ChakraLink as={ReactRouterLink} to="/login">
                  Login
                </ChakraLink>
              </Text>
            </VStack>
          </form>
        </FormProvider>
      </Box>
    </Container>
  );
};

export default Register;
