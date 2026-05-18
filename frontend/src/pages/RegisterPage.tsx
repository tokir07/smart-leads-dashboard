import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAuthStore } from '../context/authStore';
import { authApi } from '../api/auth.api';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { toast } from '../components/ui/Toast';
import { UserRole } from '../types';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').trim(),
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.nativeEnum(UserRole).default(UserRole.SALES),
});

type RegisterFormInput = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: UserRole.SALES,
    },
  });

  const onSubmit = async (data: RegisterFormInput) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(data);
      if (res.data.success) {
        login(res.data.data.user, res.data.data.token);
        toast.success(`Account created successfully! Welcome, ${res.data.data.user.name}`);
        navigate('/dashboard');
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Registration failed. Please try again.';
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    { value: UserRole.SALES, label: 'Sales Executive (Manage Own Leads)' },
    { value: UserRole.ADMIN, label: 'System Administrator (Full Access)' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950 px-4 relative overflow-hidden transition-colors duration-300">
      {/* Decorative Gradients */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[60%] rounded-full bg-brand-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-sky-500/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md">
        {/* Logo Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gradient-to-r from-brand-500 to-brand-600 p-3 rounded-2xl text-white shadow-xl shadow-brand-500/20 mb-3 animate-bounce">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-zinc-50 tracking-tight font-sans">
            Smart Leads
          </h1>
          <p className="text-sm text-slate-400 dark:text-zinc-500 mt-1">
            Create your high-fidelity CRM account
          </p>
        </div>

        {/* Card Form container */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 p-8 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/20">
          <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100 mb-6">
            Register Workspace
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Full Name"
              type="text"
              placeholder="e.g. John Doe"
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. john@company.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Min. 6 characters"
              error={errors.password?.message}
              {...register('password')}
            />

            <Select
              label="Workspace Role"
              options={roleOptions}
              error={errors.role?.message}
              {...register('role')}
            />

            <Button
              type="submit"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              Initialize Workspace
            </Button>
          </form>

          {/* Quick Sign in Link */}
          <p className="text-sm text-center text-slate-500 dark:text-zinc-400 mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-brand-600 dark:text-brand-400 hover:underline transition-all"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
