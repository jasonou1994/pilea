import classNames from 'classnames'
import React, { FunctionComponent } from 'react'

interface ButtonProps {
  disabled: boolean
  id?: string
  onClick: (...args: any[]) => any
  style?: React.CSSProperties
  text: string
  type: 'normal' | 'primary'
  width?: number
}

export const Button: FunctionComponent<ButtonProps> = ({
  id,
  onClick,
  disabled,
  type,
  text,
  width,
  style,
}) => (
  <button
    id={id}
    onClick={onClick}
    disabled={disabled}
    className={classNames(
      'button',
      { 'button-primary': type === 'primary' },
      { 'button-disabled': disabled }
    )}
    style={{ width: width ? width : 'inherit', ...style }}
  >
    {text}
  </button>
)
