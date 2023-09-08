import styled, { css } from 'styled-components';

const color = '#BF4F74'

export const Button = styled.button<{ $primary?: boolean; }>`
  background: transparent;
  border-radius: 5px;
  border: 2px solid ${color};
  color: ${color};
  padding: 0.25em;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;

  &:hover {
    background-color: ${color};
    color: white;
  }

  ${props => props.$primary && css`
    background: ${color};
    color: white;

    &:hover {
      background-color: white;
      color: ${color};
    }
  `}
`;

export const QuestionBox = styled.div`
  border: 2px solid ${color};
`
