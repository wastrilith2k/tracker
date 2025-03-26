import { styled } from 'styled-components';

const colorPalette = [
  'rgba(51,122,183,.7)',
  'rgba(92,184,92,.7)',
  'rgba(240,173,78,.7)',
  'rgba(217,83,79,.7)',
];
const borderPalette = [
  'rgba(51,122,183,1)',
  'rgba(92,184,92,1)',
  'rgba(240,173,78,1)',
  'rgba(217,83,79,1)',
];

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

export const PageHeader = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
  height: 48px;
`;

export const PageButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  flex: 1 1 auto;
`;

export const Button = styled.button<{ $colorIndex: number }>`
  background-color: ${({ $colorIndex }) => colorPalette[$colorIndex]};
  border: 2px solid ${({ $colorIndex }) => borderPalette[$colorIndex]};
  color: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  flex: 1 1 auto;
  width: calc(100vh - 20px);
  margin: 0.5rem;
  min-height: 60px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);

  &:hover {
    background-color: ${({ $colorIndex }) => borderPalette[$colorIndex]};
  }
`;

export const StyledIcon = styled.div<{ color: string; size: number }>`
  color: ${({ color }) => color};
  font-size: ${({ size }) => `${size}px`} !important;
`;

export const BackButton = styled.button`
  position: absolute;
  top: 1rem;
  left: 1rem;
  color: white;
  border: none;
`;


export const StyledLogoutButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: white;
  border: none;
`;