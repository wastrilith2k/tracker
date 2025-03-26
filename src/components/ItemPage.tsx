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
import { Modal } from './Modal';

const ItemPage = () => {
  const { name } = useParams() as { name: string };
  const navigate = useNavigate();
  const [items, setItems] = useState<string[]>([]);
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [item, setItem] = useState<string | null>(null);

  useEffect(() => {
    const fetchedItems = fetchItems(name);
    setItems(fetchedItems);
  }, []);
  const [user] = useAuthState(auth);

  const handleItemClick = (item: string) => {
    setItem(item);
    setIsModalOpen(true);
  };

  const handleSubmit = (comment: string | null) => {
    setIsModalOpen(false);
    sendEvent(name, item as string, (user?.email ?? 'unknown') as string, comment);
    setMessage(`${name} ${item}`);
    setIsSent(true);
    setTimeout(() => navigate('/'), 2000);
  }

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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} />
    </PageContainer>
  );
};

export default ItemPage;
