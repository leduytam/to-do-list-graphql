import { useApolloClient } from '@apollo/client';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { ReactNode, createContext, useCallback, useEffect } from 'react';
import { useCookies } from 'react-cookie';

export interface IAuthContext {
  userId?: string;
  accessToken?: string;
  isAuthenticated?: boolean;
  setAccessToken: (accessToken: string) => void;
  logOut: () => Promise<void>;
}

export const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    'userId',
    'accessToken',
  ]);

  const apolloClient = useApolloClient();

  const logOut = useCallback(async () => {
    removeCookie('userId');
    removeCookie('accessToken');
    await apolloClient.clearStore();
  }, [apolloClient, removeCookie]);

  const setAccessToken = useCallback(
    (accessToken: string) => {
      const decoded = jwtDecode<JwtPayload & { username: string }>(accessToken);

      const expiresAt = new Date(decoded.exp! * 1000);

      setCookie('accessToken', accessToken, {
        expires: expiresAt,
      });

      setCookie('userId', decoded.sub, {
        expires: expiresAt,
      });
    },
    [setCookie],
  );

  useEffect(() => {
    if (!cookies.accessToken) {
      logOut();
    }
  }, [cookies.accessToken, logOut]);

  return (
    <AuthContext.Provider
      value={{
        userId: cookies.userId,
        accessToken: cookies.accessToken,
        isAuthenticated: !!cookies.userId,
        setAccessToken,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
