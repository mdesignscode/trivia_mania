"use client";
import { motion } from "framer-motion";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import styled, { css } from "styled-components";
import { classNames } from "./navigation/desktop";
import { buttonVariants } from "./store";

const color = "#ffcb74";
const dark = "#2f2f2f";
const light = "#f6f6f6";

const ButtonComponent = styled.button<{
  $primary?: boolean;
  $cta?: boolean;
  $play?: boolean;
  $showCategories?: boolean;
}>`
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
    props.$showCategories &&
    css`
      border-color: ${props.$primary ? light : dark};

      &:hover {
        border-color: ${!props.$primary ? light : dark};
      }
    `}

  ${(props) =>
    props.$cta &&
    css`
      color: ${light};
      border: 2px solid ${props.$showCategories ? light : color};
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
          border-color: ${props.$play ? dark : light};
          color: ${props.$play ? dark : light};
        }
      }
    `}
`;

export const QuestionBox = styled.div`
  border: 2px solid ${dark};

  @media (prefers-color-scheme: dark) {
    border-color: ${light};
  }
`;

interface IButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  cta?: boolean;
  primary?: boolean;
  textSize?: string;
  testid?: string;
  play?: boolean;
  showCategories?: boolean;
  parentStyles?: string;
}

export function Button({
  children,
  cta,
  primary,
  textSize,
  onClick,
  className,
  id,
  testid,
  play,
  disabled,
  showCategories,
  parentStyles,
}: IButtonProps) {
  return (
    <motion.span
      data-testid={testid}
      variants={buttonVariants}
      whileHover="hover"
      whileTap="rest"
      onClick={onClick}
      className={parentStyles}
    >
      <ButtonComponent
        className={classNames(
          className || "",
          textSize ? `text-${textSize}` : "",
          "w-full"
        )}
        id={id}
        $cta={cta}
        $primary={primary}
        $play={play}
        disabled={disabled}
        $showCategories={showCategories}
      >
        {children}
      </ButtonComponent>
    </motion.span>
  );
}
