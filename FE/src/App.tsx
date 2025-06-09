import { GoogleOAuthProvider } from '@react-oauth/google';
import AppRoutes from './router/Route';

function App() {
  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <AppRoutes />
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
