/** @format */

import { useCallback } from 'react'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Portal,
} from '@chakra-ui/react'
import React, {
  PropsWithChildren,
  ReactNode,
  createContext,
  useContext,
  useState,
} from 'react'

// type Props = {
//     children: ReactNode;
// };

// type State = {
//     confirm: (props: AlertProps) => Promise<unknown>;
// };
interface AnyEvent {
  preventDefault(): void
}

// type ActionProps = {
//     res: (value: unknown) => void;
//     e?: AnyEvent;
// };

// const AlertContext = createContext<State | null>(null);
// const AlertProvider = ({ children }: PropsWithChildren) => {
//     const [modal, setModal] = useState<ReactNode | null>();

//     const createAlert = useCallback(
//         () => (props: AlertProps) => {
//             const onOk = (res: (value: unknown) => void, e?: AnyEvent) => {
//                 e?.preventDefault();
//                 setModal(null);
//                 res(true);
//             };

//             const onCancel = (res: (value: unknown) => void, e?: AnyEvent) => {
//                 e?.preventDefault();
//                 setModal(null);
//                 res(undefined);
//             };

//             return new Promise((res) => {
//                 setModal(
//                     <ConfirmDialog
//                         {...props}
//                         onOk={onOk.bind(null, res)}
//                         onCancel={onCancel.bind(null, res)}
//                     />,
//                 );
//             });
//         },
//         [],
//     );

//     return (
//         <AlertContext.Provider value={{ confirm: createAlert() }}>
//             {children}
//             <Portal>{modal}</Portal>
//         </AlertContext.Provider>
//     );
// };

// const useAlert = () => {
//     const ctx = useContext(AlertContext);
//     if (!ctx) throw new Error("Alert Context Provider is missing");
//     return ctx;
// };

type AlertProps = {
  header: ReactNode
  message: ReactNode
  cancelText?: string
  okText?: string
}

export function ConfirmDialog({
  header,
  message,
  okText,
  cancelText,
  onOk,
  onCancel,
}: AlertProps & {
  onCancel: () => void
  onOk: () => void
}) {
  const cancelRef = React.useRef<HTMLButtonElement>(null)

  return (
    <>
      <AlertDialog
        isOpen={true}
        leastDestructiveRef={cancelRef}
        onClose={onCancel}
        motionPreset='slideInBottom'>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader
              fontSize='lg'
              fontWeight='bold'>
              {header}
            </AlertDialogHeader>

            <AlertDialogBody>{message}</AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onCancel}>
                {cancelText ?? 'Huỷ bỏ'}
              </Button>
              <Button
                colorScheme='red'
                onClick={onOk}
                ml={3}>
                {okText ?? 'Xác nhận'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
