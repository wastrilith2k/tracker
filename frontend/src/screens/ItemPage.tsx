import React, { Fragment, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchItems, sendEvent } from '../config/statsigConfig';
import {
  StyledLeftTopButton,
  Button,
  ModalActions,
  PageButtonContainer,
  PageContainer,
  PageHeader,
} from '../components/styles';
import { Icon } from '../components/Icon';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebaseConfig';
import { Modal } from '../components/Modal';
import { sendEventToAWS } from '../config/awsConfig';
import { MetricsNavButton } from '../components/MetricsNavButton';

const ItemPage = () => {
  const { name } = useParams() as { name: string };
  const navigate = useNavigate();
  const [items, setItems] = useState<string[]>([]);
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [item, setItem] = useState<string | null>(null);
  const [text, setText] = useState<string>('');

  useEffect(() => {
    const fetchedItems = fetchItems(name);
    setItems(fetchedItems);
  }, []);
  const [user] = useAuthState(auth);

  const handleItemClick = (item: string) => {
    setItem(item);
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    setIsModalOpen(false);
    sendEvent(name, item as string, (user?.email ?? 'unknown') as string, text);
    setMessage(`${name} ${item}`);

    // Send to AWS
    sendEventToAWS(
      name,
      item as string,
      (user?.uid ?? 'unknown') as string,
      text,
    ).then((response) => {
      console.debug('Response from AWS:', response);
    }).catch((error) => {
      console.error('Error sending to AWS:', error);
    });

    setIsSent(true);
    setTimeout(() => navigate('/'), 2000);
  }

  return (
    <PageContainer>
      <StyledLeftTopButton onClick={() => navigate('/')}>
        <Icon name="chevron_left" size={48} />
      </StyledLeftTopButton>
      <MetricsNavButton />
      <PageHeader>{`${name} - What?`}</PageHeader>
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3>Comment?</h3>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Enter your comment here...'
        />
        <ModalActions>
          <Button $baseWidth='100%' $colorIndex={1} onClick={() => handleSubmit()}>Submit</Button>
          <Button $baseWidth='100%' $colorIndex={1} onClick={() => { setText(''); handleSubmit() }}>Skip</Button>
          <Button $baseWidth='100%' $colorIndex={3} onClick={() => { setText(''); setIsModalOpen(false) }}>Cancel</Button>
        </ModalActions>
      </Modal>
    </PageContainer>
  );
};

export default ItemPage;
