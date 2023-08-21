/** @format */

import React, { KeyboardEventHandler, useRef } from 'react'
import { GroupBase } from 'react-select'

import CreatableSelect, { CreatableProps } from 'react-select/creatable'
import makeAnimated from 'react-select/animated'

const animated = makeAnimated()
const components = {
  ...animated,
  DropdownIndicator: null,
}

export interface InputMultiOption {
  readonly label: string
  readonly value: string
}

const createOption = (label: string) => ({
  label,
  value: label,
})
type Props = {
  /**
   * @throws{Error} for duplicate values
   * @param value
   * @returns
   */
  onCreate: (value: string) => void
  onRemove?: (removedValue: string) => void
} & CreatableProps<InputMultiOption, true, GroupBase<InputMultiOption>>
export default React.forwardRef(function MultiInput({
  onCreate,
  onRemove,
  ...props
}: Props) {
  const [inputValue, setInputValue] = React.useState('')
  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (!inputValue) return
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        // setValue((prev) => [...prev, createOption(inputValue)]);
        try {
          onCreate(inputValue)
          setInputValue('')
          event.preventDefault()
        } catch (err) {}
    }
  }

  return (
    <CreatableSelect
      components={components}
      inputValue={inputValue}
      isClearable={false}
      isMulti
      menuIsOpen={false}
      onInputChange={(newValue) => setInputValue(newValue)}
      onKeyDown={handleKeyDown}
      placeholder='Type something and press enter...'
      {...props}
      onChange={(newValue, metadata) => {
        if (metadata.action === 'remove-value') {
          onRemove?.(metadata.removedValue.value)
        }
      }}
    />
  )
})
