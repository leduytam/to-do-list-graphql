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
import { LOGIN_MUTATION } from '../graphql/auth/mutations';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Link as ReactRouterLink } from 'react-router-dom';
import { Link as ChakraLink } from '@chakra-ui/react';

const LoginSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.empty': 'Username cannot be empty',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password cannot be empty',
  }),
});

interface ILoginSchema {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const method = useForm<ILoginSchema>({
    resolver: joiResolver(LoginSchema),
  });

  const [loginMutation] = useMutation<{
    logIn: { accessToken: string };
  }>(LOGIN_MUTATION);

  const { setAccessToken } = useAuth();

  const toast = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = method;

  const onSubmit = async (data: ILoginSchema) => {
    try {
      const response = await loginMutation({
        variables: {
          user: {
            username: data.username,
            password: data.password,
          },
        },
      });

      const accessToken = response.data?.logIn.accessToken as string;

      setAccessToken(accessToken);

      navigate('/');

      toast({
        title: 'Login success',
        description: 'You are now logged in',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      if (err instanceof ApolloError) {
        toast({
          title: 'Login failed',
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
          Login
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

              <Button mt={4} w={'full'} type="submit" isLoading={isSubmitting}>
                Login
              </Button>
              <Text>
                Don't have an account?{' '}
                <ChakraLink as={ReactRouterLink} to="/register">
                  Register
                </ChakraLink>
              </Text>
            </VStack>
          </form>
        </FormProvider>
      </Box>
    </Container>
  );
};

export default Login;
