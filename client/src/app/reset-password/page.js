'use client';
import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthLayout from '@/layouts/AuthLayout';
import Input from '@/ui/Input';
import Button from '@/ui/Button';
import { resetPassword } from '@/services/authService';
import { useToast } from '@/hooks/useToast';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [pending, setPending] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const onSubmit = async ({ otp, newPassword }) => {
    setPending(true);
    try {
      await resetPassword({ email, otp, newPassword });
      showToast('Password reset — please sign in');
      router.push('/login');
    } catch (err) {
      showToast(err?.response?.data?.message || 'Invalid or expired code', 'error');
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <h2 className="font-display text-3xl text-center mb-1.5">Enter Code</h2>
      <p className="text-center text-muted text-[12.5px] mb-7">Enter the code we sent to {email}</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input label="6-digit Code" maxLength={6} error={errors.otp?.message} {...register('otp', { required: 'Code is required' })} />
        <Input label="New Password" type="password" error={errors.newPassword?.message} {...register('newPassword', { required: 'New password is required', minLength: { value: 6, message: 'At least 6 characters' } })} />
        <Button type="submit" fullWidth loading={pending}>Reset Password</Button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
