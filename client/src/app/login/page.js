'use client';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import AuthLayout from '@/layouts/AuthLayout';
import Input from '@/ui/Input';
import Button from '@/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { googleLoginUrl } from '@/services/authService';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, loginPending } = useAuth();

  return (
    <AuthLayout>
      <h2 className="font-display text-3xl text-center mb-1.5">Welcome Back</h2>
      <p className="text-center text-muted text-[12.5px] mb-7">Sign in to your Fortify account</p>

      <a
        href={googleLoginUrl()}
        className="w-full flex items-center justify-center gap-2.5 border border-[#ddd] py-3 text-[13px] font-semibold hover:bg-[#f7f7f7]"
      >
        Continue with Google
      </a>

      <div className="flex items-center gap-3 my-6 text-[11px] uppercase tracking-[0.08em] text-muted">
        <span className="flex-1 h-px bg-[#e5e5e5]" /> or sign in with email <span className="flex-1 h-px bg-[#e5e5e5]" />
      </div>

      <form onSubmit={handleSubmit((data) => login(data))}>
        <Input label="Email" type="email" error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
        <Input label="Password" type="password" error={errors.password?.message} {...register('password', { required: 'Password is required' })} />
        <div className="flex justify-end text-xs mb-5">
          <Link href="/forgot-password" className="text-navy font-semibold hover:text-gold">Forgot password?</Link>
        </div>
        <Button type="submit" fullWidth loading={loginPending}>Sign In</Button>
      </form>

      <p className="text-center text-[12.5px] text-muted mt-5">
        New to Fortify? <Link href="/signup" className="text-navy font-semibold">Create an account</Link>
      </p>
    </AuthLayout>
  );
}
