import {
  CloseButton,
  Button,
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Tooltip,
  ButtonProps,
  FormLabel,
  Input,
} from '@chakra-ui/react'
import { cn } from 'components/lib/utils'
import { produce } from 'immer'
import { UploadCloud } from 'lucide-react'
import {
  useState,
  ChangeEvent,
  useEffect,
  createContext,
  useContext,
  PropsWithChildren,
} from 'react'
import Image from 'next/image'
import { v4 as uuidv4 } from 'uuid'
import { ImageUrl } from 'types'
import { Callback, checkIsCallback } from '@/lib/callback'

type ContextState = {
  urls: ImageUrl[]
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void
  onRemove: (index: number) => void
  modalProps: ReturnType<typeof useDisclosure>
} & ContextAndProviderProps

type ContextAndProviderProps = {
  previewLimit?: number
  isMulti?: boolean
}

export type UploadProviderProps = {
  initialUrls?: ContextState['urls']
  onRemoveUrl?: Callback<(index: number) => void>
  onFilesChange?: Callback<(files: File[]) => void>
} & ContextAndProviderProps
const UploadContext = createContext<ContextState | null>(null)
const useUploadProvider = () => {
  const ctx = useContext(UploadContext)
  if (!ctx) throw new Error(`Upload Context Provider is missing`)
  return ctx
}
const UploadProvider = ({
  children,
  initialUrls,
  onFilesChange,
  onRemoveUrl,
  ...props
}: PropsWithChildren<UploadProviderProps>) => {
  const [files, setFiles] = useState<File[]>([])
  const [urls, setUrls] = useState<ContextState['urls']>([])
  const [originalUrls, setOriginalUrls] = useState<typeof urls>([])
  const [fileUrls, setFileUrls] = useState<typeof urls>([])

  useEffect(() => {
    ;[onFilesChange, onRemoveUrl].forEach(checkIsCallback)
  }, [onFilesChange, onRemoveUrl])
  useEffect(() => {
    setOriginalUrls(initialUrls ?? [])
  }, [initialUrls])

  useEffect(() => {
    console.log('useEffect file ran')
    onFilesChange?.(files)
    if (files.length) {
      setFileUrls(
        files.map((file) => ({
          name: file.name,
          url: URL.createObjectURL(file),
        })),
      )
      return
    }

    const revoke = () => {
      console.log('revoke ran')
      if (!files.length) {
        setFileUrls((prev) => {
          prev.map((url) => url.url).forEach(URL.revokeObjectURL)
          return []
        })
      }
    }

    revoke()
    return revoke
  }, [files, onFilesChange])

  useEffect(() => {
    setUrls([...originalUrls, ...fileUrls])
  }, [fileUrls, originalUrls])

  const onRemove: ContextState['onRemove'] = (index) => {
    if (index < originalUrls.length) {
      onRemoveUrl?.(index)
      setOriginalUrls(
        produce((prev) => {
          prev.splice(index, 1)
        }),
      )
      return
    }

    setFiles(
      produce((prev) => {
        prev.splice(index - originalUrls.length, 1)
      }),
    )
  }

  const onUpload: ContextState['onUpload'] = (event) => {
    const uploadFiles =
      event.target.files && [...event.target.files]?.filter((file) => !!file)

    if (!uploadFiles) {
      return
    }
    console.log('uploadFiles', uploadFiles)
    setFiles(
      produce((prev) => {
        return [...prev, ...uploadFiles]
      }),
    )
  }
  return (
    <UploadContext.Provider
      value={{
        urls,
        onUpload,
        onRemove,
        ...props,
        modalProps: useDisclosure(),
      }}
    >
      {children}
    </UploadContext.Provider>
  )
}

const UPLOAD_INPUT_ID = 'dropzone-file'
type Props = {} & UploadProviderProps
const ImageUpload = ({ ...props }: Props) => {
  const { isMulti = true } = props
  return (
    <UploadProvider {...props}>
      <Container />
      <UploadInput />
      {isMulti && <ViewMoreImageModal />}
    </UploadProvider>
  )
}

const Container = () => {
  const {
    urls,
    onRemove,
    modalProps: { onOpen },
    previewLimit = 4,
    isMulti,
  } = useUploadProvider()

  if (!urls.length) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <label
          htmlFor={UPLOAD_INPUT_ID}
          className={cn(
            `flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer`,
            `  dark:hover:bg-bray-800 dark:bg-gray-700 `,
            ` dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600`,
            'border-2 border-dashed border-gray-300  bg-gray-50 hover:bg-gray-100 hover:scale-105 duration-300',
          )}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
            <svg
              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click để thêm hình ảnh</span> hoặc
              kéo thả
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              (SVG, PNG, JPG or GIF){' '}
              <span className="hidden">(MAX. 800x400px)</span>
            </p>
          </div>
        </label>
      </div>
    )
  }

  if (!!urls.length && !isMulti) {
    const image = urls[0]
    if (!image) return <></>
    return (
      <>
        <FormLabel htmlFor={UPLOAD_INPUT_ID} role="group" className="">
          <div
            className={cn(
              `relative min-w-[50px] p-1`,
              `aspect-square rounded-lg shadow-lg border-2 border-dotted`,
            )}
          >
            <ImagePreview image={image} idx={0} />
            <Tooltip label={image.name}>
              <p className="text-ellipsis line-clamp-1 text-zinc-600 text-sm mt-2">
                {image.name ?? ''}
              </p>
            </Tooltip>
          </div>
        </FormLabel>
      </>
    )
  }
  return (
    <>
      <div className="grid grid-cols-2 grid-rows-2 gap-4">
        {urls.slice(0, previewLimit).map((item, idx) => (
          <Box key={idx} role="group" className="">
            <div
              className={cn(
                `relative min-w-[50px] p-1`,
                `aspect-square rounded-lg shadow-lg border-2 border-dotted`,
              )}
            >
              <ImagePreview image={item} idx={idx} />
            </div>
          </Box>
        ))}
        {urls.length < previewLimit && <UploadButton />}
        {urls.length >= previewLimit && (
          <div className="col-span-2 flex justify-center">
            <Button
              p={4}
              colorScheme="blackAlpha"
              variant="solid"
              onClick={onOpen}
            >
              Xem thêm
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

const ImagePreview = function ImagePreview({
  image: item,
  idx = 0,
}: {
  image: ImageUrl
  idx?: number
}) {
  return (
    <>
      <Image
        src={item.url}
        width="100"
        height="100"
        alt={item.name || 'uploaded image'}
        className="w-full h-full object-contain rounded-lg"
      />
      <RemoveButton index={idx} />
    </>
  )
}

const UploadInput = () => {
  const { onUpload, isMulti = true } = useUploadProvider()
  return (
    <Input
      id={UPLOAD_INPUT_ID}
      type="file"
      multiple={isMulti}
      className="hidden"
      accept="image/*"
      onChange={onUpload}
    />
  )
}

const UploadButton = (props: ButtonProps) => {
  return (
    <Button
      as="label"
      h="full"
      display="flex"
      flexDir={'column'}
      gap={2}
      textColor={'gray.500'}
      cursor="pointer"
      {...props}
    >
      <UploadCloud /> Chọn thêm ảnh
      {/* <UploadInput /> */}
    </Button>
  )
}

const RemoveButton = ({ index, ...props }: { index: number } & ButtonProps) => {
  const { onRemove } = useUploadProvider()
  return (
    <CloseButton
      pos={'absolute'}
      right={'0'}
      top={'0'}
      textColor="red"
      display={'none'}
      bg="whiteAlpha.500"
      _groupHover={{
        display: 'block',
      }}
      _hover={{
        bg: 'whiteAlpha.900',
      }}
      rounded="full"
      size={'sm'}
      onClick={onRemove.bind(this, index)}
      {...props}
    />
  )
}
const ViewMoreImageModal = () => {
  const {
    urls,
    modalProps: { isOpen, onClose },
  } = useUploadProvider()
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Hình ảnh sản phẩm</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            <div
              className={cn(
                'grid grid-cols-2 gap-4 auto-rows-max',
                `grid-rows-${Math.floor(urls.length / 2) + 1}`,
                ``,
              )}
            >
              {urls.map(({ name, url }, idx) => (
                <Tooltip key={uuidv4()} label={name}>
                  <Box role="group">
                    <div
                      className={cn(
                        'relative p-4 text-center border border-dashed rounded-lg',
                      )}
                    >
                      <Image
                        src={url}
                        width={'200'}
                        height={'200'}
                        className="object-contain w-[200px] aspect-square mx-auto"
                        alt="name"
                      />
                      <p className="text-ellipsis line-clamp-1 text-zinc-600 text-sm">
                        {name}
                      </p>
                      <RemoveButton
                        index={idx}
                        _hover={{
                          bg: 'gray.50',
                          shadow: 'md',
                        }}
                      />
                    </div>
                  </Box>
                </Tooltip>
              ))}
              <UploadButton py={'4'} minH="200px" />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ImageUpload
