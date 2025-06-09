import { GoogleOAuthProvider } from '@react-oauth/google';
import AppRoutes from './router/Route';

const googleClientId = import.meta.env.VITE_CLIENT_ID;
if (!googleClientId) {
  throw new Error('VITE_CLIENT_ID is not defined in .env file');
}

function App() {
  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
        <AppRoutes />
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
