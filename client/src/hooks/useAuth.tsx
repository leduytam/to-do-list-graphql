import { useContext } from 'react';
import { AuthContext, IAuthContext } from '../contexts/AuthContext';

export const useAuth = () => useContext(AuthContext) as IAuthContext;
