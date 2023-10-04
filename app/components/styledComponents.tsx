"use client";
import styled, { css } from "styled-components";

const color = "#ffcb74";
const dark = "#2f2f2f";
const light = "#f6f6f6";

export const Button = styled.button<{ $primary?: boolean; $cta?: boolean }>`
  background: transparent;
  border-radius: 5px;
  border: 2px solid ${color};
  padding: 0.25em;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;

  &:hover {
    background-color: ${color};
    color: white;
  }

  @media (prefers-color-scheme: dark) {
    &:hover {
      color: ${dark};
    }
  }

  ${(props) =>
    props.$primary &&
    css`
      background: ${color};
      color: white;

      &:hover {
        border-color: ${dark};
        background: transparent;
        color: ${dark};
      }

      @media (prefers-color-scheme: dark) {
        color: ${dark};

        &:hover {
          border-color: ${light};
          background: transparent;
          color: ${light};
        }
      }
    `}

  ${(props) =>
    props.$cta &&
    css`
      color: ${light};
      border: 2px solid ${color};
      padding: 0.75rem;
      letter-spacing: 2px;
      min-width: 160px;
      height: 48px;
      text-transform: uppercase;
      white-space: normal;
      font-weight: 700;
      margin-top: 1.25rem;
      display: inline-block;
      background-color: ${color};

      &:hover {
        background-color: transparent;
        color: ${dark};
        border-color: ${dark};
        border-radius: 500px;
      }

      @media (prefers-color-scheme: dark) {
        color: ${dark};

        &:hover {
          border-color: ${light};
          color: ${light};
        }
      }
    `}
`;

export const QuestionBox = styled.div`
  border: 2px solid ${dark};

  @media (prefers-color-scheme: dark) {
    border-color: ${light}
  }
`;
