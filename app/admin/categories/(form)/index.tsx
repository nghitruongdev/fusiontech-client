import useDebounceFn from '@/hooks/useDebounceFn'
import useErrorNotification from '@/hooks/useErrorNotification'
import useUploadImage, { uploadUtils } from '@/hooks/useUploadImage'
import { toArrayOptionString } from '@/lib/utils'
import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Spinner,
    Textarea,
} from '@chakra-ui/react'
import { Create, Edit } from '@components/crud'
import ImageUpload, { UploadProviderProps } from '@components/image-upload'
import { Action, useCustom } from '@refinedev/core'
import { useForm } from '@refinedev/react-hook-form'
import { HttpError } from 'http-errors'
import {
    BaseSyntheticEvent,
    PropsWithChildren,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
} from 'react'
import { Controller } from 'react-hook-form'
import CreatableSelect from 'react-select/creatable'
import { ICategory, ICategoryField } from 'types'
import { API, API_URL } from 'types/constants'
import { ERRORS } from 'types/messages'

type ContextProps = {
    action: Action
    category: ICategory | undefined
} & ReturnType<typeof useForm<ICategory, HttpError, ICategoryField>>

export const Form = ({ action }: { action: ContextProps['action'] }) => {
    return (
        <Form.Provider action={action}>
            <Form.Body />
        </Form.Provider>
    )
}

Form.Context = createContext<ContextProps | null>(null)

Form.useContext = () => {
    const context = useContext(Form.Context)
    if (!context) {
        throw new Error('FormContext.Provider is missing')
    }
    return {
        ...context,
    }
}

Form.Provider = function Provider({
    action,
    children,
}: PropsWithChildren<{ action: ContextProps['action'] }>) {
    const { uploadImages, removeImages } = useUploadImage({
        resource: 'categories',
    })

    const formProps = useForm<ICategory, HttpError, ICategoryField>({
        refineCoreProps: {
            redirect: 'show',
        },
    })
    const {
        handleSubmit,
        refineCore: {
            formLoading,
            onFinish,
            queryResult: { data: { data: category } = { data: undefined } } = {},
        },
        formState: { dirtyFields },
    } = formProps

    const saveProps = {
        disabled: formLoading,
        onClick: (e: BaseSyntheticEvent) => {
            console.log('custom onClick')
            handleSubmit(async ({ id, formSpecifications, file, ...value }) => {
                const handleImage = async () => {
                    if (action === 'edit' && dirtyFields.image) {
                        const removedImage = category?.image
                        removedImage && removeImages([removedImage])
                    }
                    return file && (await uploadImages([file]))[0]
                }

                const handleSpecifications = () => {
                    if (!dirtyFields.formSpecifications) return
                    console.log('formSpecifications', formSpecifications)
                    return formSpecifications?.map((item) => item.label)
                }
                const image = (await handleImage())?.url
                const specifications = handleSpecifications()

                const result = await onFinish({
                    ...value,
                    ...(image && { image }),
                    ...(specifications && { specifications }),
                })
                console.log('result', result)
            })(e)
        },
    }
    return (
        <Form.Context.Provider
            value={{ ...formProps, action, saveButtonProps: saveProps, category }}
        >
            <Form.Container>{children}</Form.Container>
        </Form.Context.Provider>
    )
}

Form.Container = function Container({ children }: PropsWithChildren) {
    const {
        action,
        refineCore: { formLoading },
        saveButtonProps,
    } = Form.useContext()

    const isEdit = action === 'edit'
    if (isEdit)
        return (
            <Edit
                isLoading={formLoading}
                saveButtonProps={saveButtonProps}
            // canDelete={soldData && (soldData.data as unknown as number) == 0}
            >
                {children}
            </Edit>
        )

    return (
        <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
            {children}
        </Create>
    )
}

type onError = ReturnType<typeof useErrorNotification>['onError']
const validateName = async (category: ICategory | undefined, onError: onError, name: string) => {
    const { findByName } = API['categories']()
    const { exists, required } = ERRORS.categories.name
    if (!name) return required
    const sendRequest = async () => {
        const response = await fetch(`${API_URL}/${findByName(name)}`)

        if (!response.ok) {
            if (response.status === 404) return true
            console.error('validate name is not ok')
            return false
        }
        const data = await response.json() as ICategory
        if (data) {
            if (!category) return exists

            if (data.id !== category.id) return exists
        }
        return true
    }
    try {
        return await sendRequest()
    } catch (err) {
        onError(err as Error)
        return false
    }
}
Form.Body = function Body() {
    const {
        action,
        category,
        register,
        formState: { errors },
    } = Form.useContext()
    const isEdit = action === 'edit'
    const { onError } = useErrorNotification()
    const [checkValue, isChecking] = useDebounceFn(validateName.bind(null, category, onError), 300)

    return (
        <div className="grid grid-cols-4 gap-4">
            <div className="max-h-[300px] min-h-[200px] p-4">
                <Form.Image />
            </div>
            <div className="col-span-3 gap-4">
                {isEdit && (
                    <FormControl mb="3" isInvalid={!!(errors as any)?.id}>
                        <FormLabel>Id</FormLabel>
                        <Input disabled type="number" {...register('id')} />
                        <FormErrorMessage>
                            {(errors as any)?.id?.message as string}
                        </FormErrorMessage>
                    </FormControl>
                )}
                <FormControl mb="3" isInvalid={!!(errors as any)?.name}>
                    <FormLabel>Tên danh mục</FormLabel>

                    <InputGroup>
                        <Input
                            type="text"
                            {...register('name', {
                                required: ERRORS.brands.name.required,
                                setValueAs: (value) => value && value.trim(),
                                validate: async (value) => await checkValue(value.trim()),

                            })
                            }

                        />
                        <InputRightElement>
                            {isChecking &&
                                <Spinner color='blue.600' />}
                        </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>
                        {(errors as any)?.name?.message as string}
                    </FormErrorMessage>
                </FormControl>
                <FormControl mb="3" isInvalid={!!(errors as any)?.slug}>
                    <FormLabel>Slug</FormLabel>
                    <Input
                        type="text"
                        {...register('slug', {
                            required: 'Vui lòng nhập slug.',
                        })}
                    />
                    <FormErrorMessage>
                        {(errors as any)?.slug?.message as string}
                    </FormErrorMessage>
                </FormControl>
                <Form.Specifications />
                <FormControl mb="3" isInvalid={!!(errors as any)?.description}>
                    <FormLabel>Mô tả danh mục</FormLabel>
                    <Textarea {...register('description', {})} />
                    <FormErrorMessage>
                        {(errors as any)?.description?.message as string}
                    </FormErrorMessage>
                </FormControl>
            </div>
        </div>
    )
}

Form.Image = function Image() {
    const { category, setValue } = Form.useContext()

    const onFilesChange: UploadProviderProps['onFilesChange'] = useCallback(
        (files: File[]) => setValue('file', files[0]),
        [setValue],
    )
    onFilesChange.isCallback = true

    const onRemove: UploadProviderProps['onRemoveUrl'] = useCallback(() => {
        setValue(`image`, null, {
            shouldDirty: true,
        })
    }, [setValue])
    onRemove.isCallback = true

    const imageUrl = category?.image
    const initialUrls = useMemo(() => {
        console.count('usememo initialUrl ran')
        const name = imageUrl ? uploadUtils.getName("categories", imageUrl) : ""
        return imageUrl ? [{ name, url: imageUrl }] : []
    }, [imageUrl])
    return (
        <FormControl w="full" h="full">
            <ImageUpload
                onFilesChange={onFilesChange}
                onRemoveUrl={onRemove}
                isMulti={false}
                {...(category?.image && { initialUrls })}
            />
        </FormControl>
    )
}

Form.Specifications = function Specifications() {
    const { findDistinctNames } = API['specifications']()
    const {
        category,
        formState: { errors },
        control,
        resetField,
    } = Form.useContext()
    const { data: { data: specsData } = {} } = useCustom<string[]>({
        url: findDistinctNames,
        method: 'get',
        errorNotification: false,
    })
    const specOptions = useMemo(
        () => [
            ...toArrayOptionString(category?.specifications ?? []),
            ...toArrayOptionString(specsData ?? []),
        ],
        [specsData, category?.specifications],
    )

    useEffect(() => {
        const specs = category?.specifications
        specs &&
            resetField(`formSpecifications`, {
                defaultValue: toArrayOptionString(specs),
            })
    }, [category?.specifications, resetField])

    return (
        <FormControl mb="3" isInvalid={!!errors?.specifications}>
            <FormLabel>Nhóm thông số kỹ thuật</FormLabel>
            <Controller
                render={({ field }) => (
                    <CreatableSelect {...field} isMulti options={specOptions} />
                )}
                name="formSpecifications"
                control={control}
            />
            <FormErrorMessage>
                {errors?.specifications?.message as string}
            </FormErrorMessage>
        </FormControl>
    )
}

export { Form as CategoryForm }
