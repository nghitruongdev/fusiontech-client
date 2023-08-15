/** @format */

import {
  EditableInput,
  EditableProps,
  Input,
  useColorModeValue,
} from '@chakra-ui/react'
/** @format */

import {
  Editable,
  EditablePreview,
  Tooltip,
  forwardRef,
  useEditableControls,
} from '@chakra-ui/react'

export const ChakraEditable = forwardRef<EditableProps, 'div'>(
  (props, inputRef) => (
    <Editable
      defaultValue='Rasengan ⚡️'
      isPreviewFocusable={true}
      selectAllOnFocus={false}
      {...props}>
      <Tooltip
        label='Click to edit'
        shouldWrapChildren={true}>
        <EditablePreview
          py={2}
          px={4}
          _hover={{
            background: useColorModeValue('gray.100', 'gray.700'),
          }}
        />
      </Tooltip>
      <Input
        ref={inputRef}
        py={2}
        px={4}
        as={EditableInput}
      />
      {/* <EditableControls /> */}
    </Editable>
  ),
)

function EditableControls() {
  const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps,
  } = useEditableControls()

  // return isEditing ? (
  //   <ButtonGroup
  //     justifyContent='end'
  //     size='sm'
  //     w='full'
  //     spacing={2}
  //     mt={2}>
  //     <IconButton
  //       icon={<CheckIcon />}
  //       {...getSubmitButtonProps()}
  //     />
  //     <IconButton
  //       icon={<CloseIcon boxSize={3} />}
  //       {...getCancelButtonProps()}
  //     />
  //   </ButtonGroup>
  // ) : null
}
