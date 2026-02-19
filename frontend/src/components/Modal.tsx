import { useState } from "react";
import { Button, ModalActions, ModalContent, ModalOverlay } from "./styles";

// Modal Component
export const Modal = ({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: (comment: string | null) => void }) => {
  const [comment, setComment] = useState<string>('');

  if (!isOpen) return null;


  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => { e.stopPropagation() }}>
        <h3>Comment?</h3>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Enter your comment here..."
        />
        <ModalActions>
          <Button $baseWidth='100%' $colorIndex={1} onClick={() => onSubmit(comment)}>Submit</Button>
          <Button $baseWidth='100%' $colorIndex={1} onClick={() => onSubmit(null)}>Skip</Button>
          <Button $baseWidth='100%' $colorIndex={3} onClick={onClose}>Cancel</Button>
        </ModalActions>
      </ModalContent >
    </ModalOverlay >
  );
};