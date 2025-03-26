import React, { Fragment, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchItems, sendEvent } from '../config/statsigConfig';
import {
  BackButton,
  Button,
  PageButtonContainer,
  PageContainer,
  PageHeader,
} from './styles';
import { Icon } from './Icon';
import { LogoutButton } from './LogoutButton';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebaseConfig';

const ItemPage = () => {
  const { name } = useParams() as { name: string };
  const navigate = useNavigate();
  const [items, setItems] = useState<string[]>([]);
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchedItems = fetchItems(name);
    setItems(fetchedItems);
  }, []);
  const [user] = useAuthState(auth);
  console.log('user', user);

  const handleItemClick = (item: string) => {
    console.log(`Item clicked: ${item}, Name: ${name}`);
    sendEvent(name, item, (user?.email ?? 'unknown') as string);
    setMessage(`${name} ${item}`);
    setIsSent(true);
    setTimeout(() => navigate('/'), 2000);
  };

  return (
    <PageContainer>
      <BackButton onClick={() => navigate('/')}>
        <Icon name="chevron_left" size={48} />
      </BackButton>
      <LogoutButton />
      <PageHeader>What?</PageHeader>
      <PageButtonContainer>
        {!isSent ? (
          <Fragment>
            {items.map((item, idx) => {
              const colorIndex = idx % 4;
              return (
                <Button
                  key={item}
                  onClick={() => handleItemClick(item)}
                  $colorIndex={colorIndex}
                >
                  {item}
                </Button>
              );
            })}
          </Fragment>
        ) : (
          <h1>{`Logging: ${message}`}</h1>
        )}
      </PageButtonContainer>
    </PageContainer>
  );
};

export default ItemPage;
