import { postData } from '@/api/base';
import { apiRoutes } from '@/api/routes';
import { EPath } from '@/constants/pathConstants';
import { setToken } from '@/utils/authUtils';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async ({ code }) => {
      const data = await postData(apiRoutes.signIn, {
        code,
      });
      setToken(data.id_token);
      navigate(EPath.home);
    },
    onError: () => {
      console.log('Login Failed');
    },
    flow: 'auth-code',
  });

  return (
    <section
      className="relative flex min-h-screen w-screen items-center justify-center"
      style={{
        backgroundImage:
          'linear-gradient(to right top, rgba(25, 77, 117, 0.5), rgba(77, 111, 143, 0.5), rgba(123, 147, 170, 0.5), rgba(169, 185, 198, 0.5), rgba(218, 223, 227, 0.5))',
      }}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <div
          className="w-96 rounded-lg p-6"
          style={{
            background: 'rgba( 218, 223, 227, 0.8 )',
            boxShadow: '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '10px',
          }}
        >
          <h1 className="text-primary mb-2 text-2xl font-bold">Welcome</h1>
          <p className="text-primary mb-4 text-base">
            Please login to continue
          </p>
          <button
            className="bg-primary text-secondary w-full cursor-pointer rounded-md px-4 py-2 transition-colors hover:opacity-90"
            onClick={() => login()}
          >
            Sign in with Google 🚀
          </button>
        </div>
      </div>
    </section>
  );
};

export default Login;
