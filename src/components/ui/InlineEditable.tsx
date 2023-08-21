/** @format */

import { CloseIcon, CheckIcon, DeleteIcon } from '@chakra-ui/icons'
import {
  useEditableControls,
  ButtonGroup,
  IconButton,
  Editable,
  Tooltip,
  EditablePreview,
  useColorModeValue,
  Input,
  EditableInput,
  EditableProps,
  InputProps,
  Icon,
} from '@chakra-ui/react'
import { Ban, MinusCircle, Trash } from 'lucide-react'
import {
  createContext,
  forwardRef,
  useEffect,
  useRef,
  PropsWithChildren,
  useContext,
} from 'react'

type State = {
  control: ReturnType<typeof useEditableControls>
} & Props
const Context = createContext<State | null>(null)
const useEditableContext = () => {
  const ctx = useContext(Context)
  if (!ctx) throw new Error('Editable.Provider is missing')
  return ctx
}
const Provider = ({ children, ...props }: PropsWithChildren<Props>) => {
  const methods = useEditableControls()
  return (
    <Context.Provider value={{ control: methods, ...props }}>
      {children}
    </Context.Provider>
  )
}

type Props = {
  inputProps?: InputProps
  editableProps?: EditableProps
  remove?: () => void
  showButtonControl?: boolean
  value?: string
  isError?: boolean
}

const InlineEditable = forwardRef(function InlineEditable(props: Props, ref) {
  const { editableProps, remove, showButtonControl, value, isError } = props

  const onBlurHandler = () => {
    if (!value) remove?.()
  }
  return (
    <Editable
      isPreviewFocusable={true}
      selectAllOnFocus={true}
      placeholder={'Enter your placeholder here ⚡️'}
      {...editableProps}
      onBlur={onBlurHandler}
      rounded='lg'
      ref={ref}>
      <Provider {...props}>
        <div className='flex items-center'>
          <DeleteButton />
          <div className='w-full grid'>
            <Preview />
            <InlineInput />
          </div>
        </div>
        {showButtonControl && <EditableControls />}
      </Provider>
      {/* isHover && remove && */}
    </Editable>
  )
})
const DeleteButton = () => {
  const { remove } = useEditableContext()
  return (
    <>
      {remove && (
        <IconButton
          icon={
            <Icon
              as={MinusCircle}
              color={'white'}
              fill={'red.500'}
              _hover={{
                fill: 'red.400',
              }}
            />
          }
          boxSize={'fit-content'}
          p={0}
          onClick={remove}
          aria-label='Delete feature'
          variant='unstyled'
          display={'flex'}
          justifyContent='center'
        />
      )}
    </>
  )
}

const Preview = () => {
  const { value, isError } = useEditableContext()
  return (
    <Tooltip
      label={`Chỉnh sửa ${value}`}
      shouldWrapChildren={true}>
      <EditablePreview
        py={2}
        px={4}
        w='full'
        _hover={{
          background: useColorModeValue('blackAlpha.100', 'gray.700'),
        }}
        color={value ? 'gray.700' : 'gray.500'}
        {...(isError && {
          color: 'red',
          border: '1px',
          borderColor: 'red.500',
        })}
      />
    </Tooltip>
  )
}

const InlineInput = () => {
  const { inputProps, remove, isError } = useEditableContext()
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <>
      <Input
        // py={2}
        // px={2}
        as={EditableInput}
        ref={inputRef}
        border={0}
        // size="sm"
        {...inputProps}
      />
    </>
  )
}

const EditableControls = () => {
  const {
    control: { isEditing, getCancelButtonProps, getSubmitButtonProps },
  } = useEditableContext()
  return isEditing ? (
    <ButtonGroup
      justifyContent='end'
      size='sm'
      w='full'
      spacing={2}
      mt={2}>
      <IconButton
        icon={<CheckIcon />}
        {...getSubmitButtonProps()}
        aria-label='Check icon'
      />
      <IconButton
        icon={<CloseIcon boxSize={3} />}
        {...getCancelButtonProps()}
        aria-label='Close Icon'
      />
    </ButtonGroup>
  ) : null
}

export default InlineEditable
