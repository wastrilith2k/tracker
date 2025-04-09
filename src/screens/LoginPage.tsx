import React from 'react';
import {
  PageContainer,
  PageHeader,
} from '../components/styles';
import { LoginButton } from '../components/LoginButton';

const LoginPage: React.FC = () => {

  return (
    <PageContainer>
      <PageHeader>Login</PageHeader>
      <LoginButton />
    </PageContainer>
  );
};

export default LoginPage;
