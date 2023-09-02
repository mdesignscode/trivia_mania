import styled, { css } from 'styled-components';

const color = '#BF4F74'

export const Button = styled.button<{ $primary?: boolean; }>`
  background: transparent;
  border-radius: 5px;
  border: 2px solid ${color};
  color: ${color};
  padding: 0.25em;

  &:hover {
    background-color: ${color};
    color: white;
  }

  ${props => props.$primary && css`
    background: ${color};
    color: white;

    &:hover {
      background-color: ${color};
      color: white;
      border-color: white;
    }
  `}
`;

export const QuestionBox = styled.div`
  border: 2px solid ${color};
`
