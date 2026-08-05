'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/layouts/AuthLayout';
import Input from '@/ui/Input';
import Button from '@/ui/Button';
import { forgotPassword } from '@/services/authService';
import { useToast } from '@/hooks/useToast';

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [pending, setPending] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const onSubmit = async ({ email }) => {
    setPending(true);
    try {
      await forgotPassword(email);
      showToast('Reset code sent — check your email');
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      showToast(err?.response?.data?.message || 'No account found with that email', 'error');
    } finally {
      setPending(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="font-display text-3xl text-center mb-1.5">Reset Password</h2>
      <p className="text-center text-muted text-[12.5px] mb-7">Enter your account email and we&apos;ll send a reset code</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input label="Email" type="email" error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
        <Button type="submit" fullWidth loading={pending}>Send Reset Code</Button>
      </form>

      <p className="text-center text-[12.5px] mt-5">
        <Link href="/login" className="text-navy font-semibold">Back to sign in</Link>
      </p>
    </AuthLayout>
  );
}
