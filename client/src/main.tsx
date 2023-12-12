import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { CookiesProvider } from 'react-cookie';
import { ChakraProvider, ThemeConfig, extendTheme } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <CookiesProvider>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </CookiesProvider>
  </BrowserRouter>,
  // </React.StrictMode>,
);
