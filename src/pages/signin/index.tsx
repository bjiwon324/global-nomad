import AuthForm from '@/components/auth/signin/AuthForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormValues } from '@/types/auth';
import { SubmitHandler } from 'react-hook-form';
import { auth } from '@/apis/auth';
import { useRef, useState } from 'react';
import { AxiosError } from 'axios';
import Router from 'next/router';
import Popup from '@/components/common/popup/confirm/Confirm';

interface ErrorMessage {
  message: string;
}

export default function Signin() {
  const [popupError, setPopupError] = useState<string>('');
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const handleOpenPopup = (error: string) => {
    if (!dialogRef.current) return;

    dialogRef.current.showModal();
    setPopupError(error);
  };

  const queryClient = useQueryClient();

  const signupMutation = useMutation({
    mutationFn: (data: FormValues) => auth.signin(data),
    mutationKey: ['signin'],
    onSuccess: (data) => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      if (data.accessToken) {
        const accessToken = data.accessToken;
        const refreshToken = data.refreshToken;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        queryClient.setQueryData(['user'], data.user);

        Router.replace('/');
      }
    },
    onError: (error: AxiosError<ErrorMessage>) => {
      if (error.response && error.response.status >= 400) {
        handleOpenPopup(error.response.data?.message);
        return;
      }
      console.error('AxiosError', error);
    },
  });

  const onSigninSubmit: SubmitHandler<FormValues> = (data) => {
    signupMutation.mutate(data);
  };

  if (signupMutation.isPending) {
    <div>Loading...</div>;
  }

  return (
    <>
      <AuthForm onSigninSubmit={onSigninSubmit} />
      <Popup dialogRef={dialogRef} text={popupError} />
    </>
  );
}
