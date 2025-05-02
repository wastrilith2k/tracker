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
  StyledLeftBottomButton,
  ConfigLink,
} from '../components/styles';
import { Icon } from '../components/Icon';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebaseConfig';
import { Modal } from '../components/Modal';
import { sendEventToAWS } from '../config/awsConfig';
import { MetricsNavButton } from '../components/MetricsNavButton';
import { createNamedEvent, deleteEvent, fetchEvents, updateEvents } from '../utils/aws.utils';
import { AwsNamedEvent } from '../utils/types';
import { useEditMode } from '../components/EditStateProvider';
import { Reorder } from 'framer-motion';

const ItemPage = () => {
  const { name } = useParams() as { name: string };
  const navigate = useNavigate();
  const [items, setItems] = useState<string[]>([]);
  const [events, setEvents] = useState<AwsNamedEvent[]>([]);
  const [newEventName, setNewEventName] = useState<string>('');
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('');
  const [isLogEventModalOpen, setIsLogEventModalOpen] = useState<boolean>(false);
  const [item, setItem] = useState<string | null>(null);
  const [text, setText] = useState<string>('');

  const [isAddEventNameModalOpen, setIsAddEventNameModalOpen] = useState<boolean>(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState<boolean>(false);
  const [eventToDelete, setEventToDelete] = useState<AwsNamedEvent | null>(null);
  const { editMode, setEditMode } = useEditMode();

  const loadEvents = () => {
    fetchEvents(user?.uid ?? 'unknown', name).then((events) => {
      console.debug('Fetched AWS events:', events);
      events.sort((a: AwsNamedEvent, b: AwsNamedEvent) => a.sortOrder - b.sortOrder);
      setEvents(events);
    })
  };

  useEffect(() => {
    const fetchedItems = fetchItems(name);
    setItems(fetchedItems);
    loadEvents();
  }, []);
  const [user] = useAuthState(auth);

  const handleItemClick = (item: string) => {
    setItem(item);
    setIsLogEventModalOpen(true);
  };

  const handleSubmit = () => {
    setIsLogEventModalOpen(false);
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


  const handleAddEventClick = () => {
    setIsAddEventNameModalOpen(true);
  }

  const handleDeleteEventClick = (name: AwsNamedEvent) => {
    setEventToDelete(name);
    setIsDeleteConfirmModalOpen(true);
  };

  const handleDeleteNameSubmit = () => {
    if (eventToDelete !== null) {
      deleteEvent(eventToDelete, user?.uid ?? 'unknown').then(() => {
        loadEvents();
      }).catch((error) => {
        console.error('Error deleting name:', error);
      }).finally(() => {
        setEventToDelete(null);
        setIsDeleteConfirmModalOpen(false);
      });
    };
  }

  const handleAddEventSubmit = () => {
    if (newEventName !== null && newEventName.trim() !== '') {
      createNamedEvent(name, newEventName, user?.uid ?? 'unknown').then(() => {
        setIsAddEventNameModalOpen(false);
        loadEvents();
      })
        .catch((error) => {
          console.error('Error creating name:', error);
        }).finally(() => {
          setNewEventName('');
          setIsAddEventNameModalOpen(false);
        });
    }
  };

  const handleReorder = (newOrder: AwsNamedEvent[]) => {
    console.log('new Order:', newOrder);
    setEvents(newOrder);
    const payload = newOrder.map((event, index) => ({ ...event, sortOrder: index }));
    updateEvents(payload, name, user?.uid ?? 'unknown')
  };


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
            {editMode ? (<Reorder.Group axis='y' values={events} onReorder={handleReorder}>
              {events.map((event, idx) => {
                const colorIndex = idx % 4;
                return (
                  <Reorder.Item key={event.id} value={event}>
                    <span onClick={() => handleDeleteEventClick(event)}>
                      <Icon name="delete" size={24} fill />
                    </span>
                    <Button
                      key={event.id}
                      onClick={() => handleItemClick(event.event)}
                      $colorIndex={colorIndex}
                    >
                      {event.event}
                    </Button>
                    <Icon name="drag_pan" size={48} fill />
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>) : (
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
            )}</Fragment>) : (
          <h1>{`Logging: ${message}`}</h1>
        )}
        {
          editMode && !isSent ? (<ConfigLink
            key='add-event'
            onClick={() => handleAddEventClick()}
          >
            + Add Event
          </ConfigLink>) : null
        }
      </PageButtonContainer>
      <Modal isOpen={isLogEventModalOpen} onClose={() => setIsLogEventModalOpen(false)}>
        <h3>Comment?</h3>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Enter your comment here...'
        />
        <ModalActions>
          <Button $baseWidth='100%' $colorIndex={1} onClick={() => handleSubmit()}>Submit</Button>
          <Button $baseWidth='100%' $colorIndex={1} onClick={() => { setText(''); handleSubmit() }}>Skip</Button>
          <Button $baseWidth='100%' $colorIndex={3} onClick={() => { setText(''); setIsLogEventModalOpen(false) }}>Cancel</Button>
        </ModalActions>
      </Modal>
      <Modal isOpen={isAddEventNameModalOpen} onClose={() => setIsAddEventNameModalOpen(false)}>
        <h3>Add Event to track</h3>
        <input type="text"
          value={newEventName}
          onChange={(e) => {
            setNewEventName(e.target.value);

          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddEventSubmit();
            }
          }}
          placeholder='Name'
        />
        <ModalActions>
          <Button $baseWidth='100%' $colorIndex={1} onClick={() => handleAddEventSubmit()}>Submit</Button>
          <Button $baseWidth='100%' $colorIndex={3} onClick={() => { setNewEventName(''); setIsAddEventNameModalOpen(false) }}>Cancel</Button>
        </ModalActions>
      </Modal>
      <Modal isOpen={isDeleteConfirmModalOpen} onClose={() => { setIsDeleteConfirmModalOpen(false) }}>
        <h3>{`Confirm Deletion of ${eventToDelete?.name}`}</h3>
        <ModalActions>
          <Button $baseWidth='100%' $colorIndex={1} onClick={handleDeleteNameSubmit}>Confirm</Button>
          <Button $baseWidth='100%' $colorIndex={3} onClick={() => {
            setEventToDelete(null);
            setIsDeleteConfirmModalOpen(false);
          }}>Cancel</Button>
        </ModalActions>
      </Modal>
      <StyledLeftBottomButton onClick={() => setEditMode(!editMode)}>
        <Icon name="settings" size={24} fill={editMode} />
      </StyledLeftBottomButton>
    </PageContainer>
  );
};

export default ItemPage;
