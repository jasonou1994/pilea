import React, { FunctionComponent } from 'react'
import classNames from 'classnames'

interface ButtonProps {
  onClick: (...args: any[]) => any
  type: 'normal' | 'primary'
  disabled: boolean
  text: string
  width?: number
}

export const Button: FunctionComponent<ButtonProps> = ({
  onClick,
  disabled,
  type,
  text,
  width,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={classNames(
      'button',
      { 'button-primary': type === 'primary' },
      { 'button-disabled': disabled }
    )}
    style={{ width: width ? width : 'inherit' }}
  >
    {text}
  </button>
)
