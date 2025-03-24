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

export const MainPage: React.FC = () => {
  const [names, setNames] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchedNames = fetchNames();
    console.log('Fetched names:', fetchedNames);
    setNames(fetchedNames);
  }, []);

  const handleButtonClick = (name: string) => {
    navigate(`/items/${name}`);
  };

  return (
    <PageContainer>
      <PageHeader>Who?</PageHeader>
      <LogoutButton/>
      <PageButtonContainer>
        {names.map((name, idx) => {
          const colorIndex = idx % 4;
          return (
            <Button
              key={name}
              onClick={() => handleButtonClick(name)}
              $colorIndex={colorIndex}
            >
              {name}
            </Button>
          );
        })}
      </PageButtonContainer>
    </PageContainer>
  );
};

export default MainPage;
