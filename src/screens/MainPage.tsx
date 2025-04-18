import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  ConfigLink,
  ModalActions,
  PageButtonContainer,
  PageContainer,
  PageHeader,
  StyledLeftBottomButton,
} from '../components/styles';
import { LogoutButton } from '../components/LogoutButton';
import { Modal } from '../components/Modal';
import { createName, deleteName, fetchNames as fetchAwsNames, updateNames } from '../config/awsConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebaseConfig';
import { useEditMode } from '../components/EditStateProvider';
import { Icon } from '../components/Icon';
import { Reorder } from 'framer-motion';
import { AwsName } from '../utils/types';

export const MainPage: React.FC = () => {
  const [names, setNames] = useState<AwsName[]>([]);
  const [newName, setNewName] = useState<string>('');
  const [isAddNameModalOpen, setIsAddNameModalOpen] = useState<boolean>(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState<boolean>(false);
  const [nameToDelete, setNameToDelete] = useState<AwsName | null>(null);
  const navigate = useNavigate();
  const { editMode, setEditMode } = useEditMode();

  const [user] = useAuthState(auth);

  const loadNames = () => {
    fetchAwsNames(user?.uid ?? 'unknown').then((names) => {
      console.debug('Fetched AWS names:', names);
      names.sort((a: AwsName, b: AwsName) => a.sortOrder - b.sortOrder);
      setNames(names);
    })
  }

  useEffect(() => {
    loadNames();
  }, []);

  const handleButtonClick = (name: string) => {
    navigate(`/items/${name}`);
  };

  const handleAddNameClick = () => {
    setIsAddNameModalOpen(true);
  }

  const handleDeleteNameClick = (name: AwsName) => {
    setNameToDelete(name);
    setIsDeleteConfirmModalOpen(true);
  };

  const handleDeleteNameSubmit = () => {
    if (nameToDelete !== null) {
      deleteName(nameToDelete, user?.uid ?? 'unknown').then(() => {
        loadNames();
      }).catch((error) => {
        console.error('Error deleting name:', error);
      }).finally(() => {
        setNameToDelete(null);
        setIsDeleteConfirmModalOpen(false);
      });
    };
  }

  const handleAddNameSubmit = () => {
    if (newName !== null && newName.trim() !== '') {
      createName(newName, user?.uid ?? 'unknown').then(() => {
        setIsAddNameModalOpen(false);
        loadNames();
      })
        .catch((error) => {
          console.error('Error creating name:', error);
        }).finally(() => {
          setNewName('');
          setIsAddNameModalOpen(false);
        });
    }
  };

  const handleReorder = (newOrder: AwsName[]) => {
    console.log('new Order:', newOrder);
    setNames(newOrder);
    const payload = newOrder.map((name, index) => ({ ...name, sortOrder: index }));
    updateNames(payload, user?.uid ?? 'unknown')
  };

  return (
    <PageContainer>
      <PageHeader>Who?</PageHeader>
      <LogoutButton />
      <PageButtonContainer>
        {editMode ? (<Reorder.Group axis='y' values={names} onReorder={handleReorder}>
          {names.map((name, idx) => {
            const colorIndex = idx % 4;
            return (
              <Reorder.Item key={name.id} value={name}>
                <span onClick={() => handleDeleteNameClick(name)}>
                  <Icon name="delete" size={24} fill />
                </span>
                <Button
                  key={name.id}
                  onClick={() => handleButtonClick(name.name)}
                  $colorIndex={colorIndex}
                >
                  {name.name}
                </Button>
                <Icon name="drag_pan" size={48} fill />
              </Reorder.Item>
            );
          })}
        </Reorder.Group>) : (
          <Fragment>{
            names.map((name, idx) => {
              const colorIndex = idx % 4;
              return (
                <Button
                  key={name.id}
                  onClick={() => handleButtonClick(name.name)}
                  $colorIndex={colorIndex}
                >
                  {name.name}
                </Button>
              );
            })
          }
          </Fragment>
        )}
        {
          editMode ? (<ConfigLink
            key='add-name'
            onClick={() => handleAddNameClick()}
          >
            + Add Name
          </ConfigLink>) : null
        }
      </PageButtonContainer>
      <Modal isOpen={isAddNameModalOpen} onClose={() => setIsAddNameModalOpen(false)}>
        <h3>Add Name</h3>
        <input type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder='Name'
        />
        <ModalActions>
          <Button $baseWidth='100%' $colorIndex={1} onClick={() => handleAddNameSubmit()}>Submit</Button>
          <Button $baseWidth='100%' $colorIndex={3} onClick={() => { setNewName(''); setIsAddNameModalOpen(false) }}>Cancel</Button>
        </ModalActions>
      </Modal>
      <Modal isOpen={isDeleteConfirmModalOpen} onClose={() => { setIsDeleteConfirmModalOpen(false) }}>
        <h3>{`Confirm Deletion of ${nameToDelete?.name}`}</h3>
        <ModalActions>
          <Button $baseWidth='100%' $colorIndex={1} onClick={handleDeleteNameSubmit}>Confirm</Button>
          <Button $baseWidth='100%' $colorIndex={3} onClick={() => {
            setNameToDelete(null);
            setIsDeleteConfirmModalOpen(false);
          }}>Cancel</Button>
        </ModalActions>
      </Modal>
      <StyledLeftBottomButton onClick={() => setEditMode(!editMode)}>
        <Icon name="settings" size={24} fill={editMode} />
      </StyledLeftBottomButton>
    </PageContainer >
  );
};

export default MainPage;
