import React, { FunctionComponent } from 'react'
import classNames from 'classnames'
import { placeholder } from '@babel/types'

interface TextInputProps {
  label?: string
  invalid: boolean
  type: 'text' | 'password'
  placeholder: string
  value: string
  onChange: (input: string) => any
}

export const TextInput: FunctionComponent<TextInputProps> = ({
  label,
  invalid,
  type,
  value,
  onChange,
  placeholder,
}) => (
  <div className="input-group">
    {label && <span>{label}</span>}
    <input
      className={classNames({ invalid })}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
    ></input>
  </div>
)
