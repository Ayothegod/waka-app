import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import { authAPI } from '@/services/api';
import { loginSchema } from '@/schemas/auth';
import type { AnyFieldApi } from '@tanstack/react-form'
import { AuthBackground } from '@/components/auth/AuthBackground';
import { AuthLogo } from '@/components/auth/AuthLogo';

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em className="text-red-500 text-sm mt-1">{field.state.meta.errors.map((err) => err.message).join(',')}</em>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  )
}

export default function Login() {
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      navigate('/');
    },
  });

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      try {
        await loginSchema.parseAsync(value);
        loginMutation.mutate(value);
      } catch (error) {
        return { error };
      }
    },
    validators: {
      onChange: loginSchema,
    },
  });

  return (
    <>
      <AuthBackground />
      <div className="min-h-[80vh] flex items-center justify-center relative z-10">
        <div className="bg-white/70 backdrop-blur-sm p-8 rounded-lg shadow-lg w-full max-w-md">
        <AuthLogo />
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

          {loginMutation.error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md flex items-center">
              <FiAlertCircle className="mr-2" />
              {loginMutation.error.message}
            </div>
          )}

          <form onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }} className="space-y-4">
            <form.Field name="email">
              {(field) => (
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="email"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                          ${field.state.meta.isTouched && !field.state.meta.isValid ? 'border-red-500' : ''}`}
                      placeholder="Enter your email"
                    />
                    <FieldInfo field={field} />
                  </div>
                </div>
              )}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <div>
                  <label className="block text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="password"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                          ${field.state.meta.isTouched && !field.state.meta.isValid ? 'border-red-500' : ''}`}
                      placeholder="Enter your password"
                    />
                    <FieldInfo field={field} />
                  </div>
                </div>
              )}
            </form.Field>

            <button
              type="submit"
              disabled={loginMutation.isPending || form.state.isSubmitting}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loginMutation.isPending ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-4 text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}