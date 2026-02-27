import { useState } from "react";
import { Button, ModalActions, ModalContent, ModalOverlay } from "./styles";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

// Modal Component
export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => { e.stopPropagation() }}>
        {children}
      </ModalContent >
    </ModalOverlay >
  );
};