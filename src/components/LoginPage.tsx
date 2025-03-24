import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchNames } from '../config/statsigConfig';
import {
  Button,
  PageButtonContainer,
  PageContainer,
  PageHeader,
} from './styles';
import { LogoutButton } from './LogoutButton';
import { LoginButton } from './LoginButton';

const MainPage: React.FC = () => {

  return (
    <PageContainer>
      <PageHeader>Login</PageHeader>
      <LoginButton/>
    </PageContainer>
  );
};

export default MainPage;
