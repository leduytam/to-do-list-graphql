import { ApolloProvider } from '@apollo/client';
import Login from './pages/Login';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import { useAppApolloClient } from './hooks/useAppApolloClient';
import { AuthProvider } from './contexts/AuthContext';
import AuthRoute from './components/AuthRoute/AuthRoute';
import Register from './pages/Register';

const App: React.FC = () => {
  const client = useAppApolloClient();

  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/:id" element={<Dashboard />} />
          </Route>

          <Route element={<AuthRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ApolloProvider>
  );
};

export default App;
