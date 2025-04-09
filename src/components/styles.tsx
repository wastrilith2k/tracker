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

export const Button = styled.button<{ $colorIndex: number; $baseWidth?: string }>`
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
  width: calc(${({ $baseWidth }) => $baseWidth ? $baseWidth : '100vh'} - 20px);
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


export const StyledRightButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: white;
  border: none;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.75);
`;

export const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 20px;
  width: 400px;
  text-align: center;

  & textArea {
  width: calc(100% - 20px);
  height: 100px;}
`;

export const ModalActions = styled.div`
  button {
    margin: 5px;
  }
`;

export const ChartWrapper = styled.div`
  width: calc(100% - 2rem);
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

export const MetricsDateRangeBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex: 1 1 auto;
  margin: 1rem;
  width: fit-content;
  height: 50px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  align-self: flex-start;
`;

export const MetricsDateRangeButton = styled.button<{ $active: boolean }>`
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  color: black;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  width:fit-content;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 8px;
  border: 2px solid ${({ $active }) => $active ? `rgba(130, 130, 130, 0.5);` : `transparent`};
`;
export const MetricsEventTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: calc(100% - 2rem);
  margin: 1rem;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`

export const MetricsEventTableHeader = styled.h2`
  font-size: 1.5rem;
  height: 48px;
  text-align: left;
  padding-left: 2rem;
  display:flex;
  align-items: center;
  width: calc(100% - 2rem);
  background-color: rgba(225, 225, 225, 0.9);
  border: 1px solid rgba(130, 130, 130, 0.5);
  margin:2px 1rem;
`
export const MetricsEventTable = styled.table`
  border-collapse: collapse;
  width: calc(100% - 2rem);
  margin: 1rem;
  transition: all 0.3s ease;
  & tr {
    border-bottom: 1px solid #ddd;
  }
  & th, & td {
    text-align: left;
    padding: 8px;
  }
  & th {
    background-color: #f2f2f2;
  }
  & tr:hover {
    background-color: #f5f5f5;
  }
`