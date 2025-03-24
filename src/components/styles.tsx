import { styled } from 'styled-components';

const colorPalette = [
  'rgba(51,122,183,.8)',
  'rgba(92,184,92,.8)',
  'rgba(240,173,78,.8)',
  'rgba(217,83,79,.8)',
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
  height: 100vh;
`;

export const PageHeader = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
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
  border: 1px solid ${({ $colorIndex }) => borderPalette[$colorIndex]};
  color: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  flex: 1 1 auto;
  width: 100vh;
  margin: 0.5rem;

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