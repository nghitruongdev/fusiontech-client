/** @format */

import { MultiValueGenericProps, GroupBase } from 'react-select'
import { useRef, useEffect } from 'react'
import { ChakraEditable } from './ChakraEditable'
import { EditableProps } from '@chakra-ui/react'
import { cleanValue } from '@/lib/utils'
export function EditableMultiValueLabel<T>({
  data,
  selectProps,
  onInputBlur,
  editableProps,
}: MultiValueGenericProps<T, true, GroupBase<T>> & {
  editableProps?: EditableProps
  onInputBlur:
    | undefined
    | ((newValue: string | undefined, currentOption: T, values: T[]) => void)
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleOnBlur = (nextValue: string) => {
    Array.isArray(selectProps.value) &&
      onInputBlur?.(inputRef.current?.value, data, selectProps.value)
  }

  return (
    <div>
      <ChakraEditable
        ref={inputRef}
        defaultValue={cleanValue(data.label)}
        onKeyDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onBlur={handleOnBlur}
        {...editableProps}
      />
    </div>
  )
}
