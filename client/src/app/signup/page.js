'use client';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import AuthLayout from '@/layouts/AuthLayout';
import Input from '@/ui/Input';
import Button from '@/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { googleLoginUrl } from '@/services/authService';

export default function SignupPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signup, signupPending } = useAuth();

  return (
    <AuthLayout>
      <h2 className="font-display text-3xl text-center mb-1.5">Create Account</h2>
      <p className="text-center text-muted text-[12.5px] mb-7">Join Fortify for faster checkout and order tracking</p>

      <a
        href={googleLoginUrl()}
        className="w-full flex items-center justify-center gap-2.5 border border-[#ddd] py-3 text-[13px] font-semibold hover:bg-[#f7f7f7]"
      >
        Continue with Google
      </a>

      <div className="flex items-center gap-3 my-6 text-[11px] uppercase tracking-[0.08em] text-muted">
        <span className="flex-1 h-px bg-[#e5e5e5]" /> or sign up with email <span className="flex-1 h-px bg-[#e5e5e5]" />
      </div>

      <form onSubmit={handleSubmit((data) => signup(data))}>
        <Input label="Full Name" error={errors.name?.message} {...register('name', { required: 'Name is required' })} />
        <Input label="Email" type="email" error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
        <Input label="Password" type="password" error={errors.password?.message} {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })} />
        <Button type="submit" fullWidth loading={signupPending} className="mt-2">Create Account</Button>
      </form>

      <p className="text-center text-[12.5px] text-muted mt-5">
        Already have an account? <Link href="/login" className="text-navy font-semibold">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
