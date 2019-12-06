import React, { FunctionComponent } from 'react'
import classNames from 'classnames'

interface TextInputProps {
  id?: string
  label?: string
  invalid: boolean
  type: 'text' | 'password'
  placeholder: string
  value: string
  onChange: (input: string) => any
}

export const TextInput: FunctionComponent<TextInputProps> = ({
  id,
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
      id={id}
      className={classNames({ invalid })}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
    ></input>
  </div>
)
