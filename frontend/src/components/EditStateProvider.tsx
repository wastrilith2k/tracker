// Write a provider that has a property for whether the app is in edit mode or not
import React, { createContext, useContext, useState } from 'react';

type EditModeContextProps = {
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
}

const EditModeContextDefaults: EditModeContextProps = {
  editMode: false,
  setEditMode: () => { }
}
const EditModeContext = createContext<EditModeContextProps>(EditModeContextDefaults);

export const EditModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [editMode, setEditMode] = useState<boolean>(false);

  return (
    <EditModeContext.Provider value={{ editMode, setEditMode }}>
      {children}
    </EditModeContext.Provider>
  );
}
export const useEditMode = (): EditModeContextProps => {
  const context = useContext(EditModeContext);
  if (!context) {
    throw new Error('useEditMode must be used within an EditModeProvider');
  }
  return context;
}
