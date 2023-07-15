// type FormProps = {};
// type State = {
//     formMethods: UseFormReturn<IRegister>;
// } & FormProps;
// type StoreState = ReturnType<typeof createFormStore>;
// const createFormStore = () => {
//     const formMethods = useForm<IRegister>({});

//     return create<State>()((set, get) => ({
//         formMethods,
//     }));
// };

// const FormContext = createContext<StoreState | null>(null);
// function useFormContext<T>(
//     selector: (state: State) => T,
//     equalityFn?: (left: T, right: T) => boolean,
// ): T {
//     const store = useContext(FormContext);
//     if (!store) throw new Error("Missing FormContext.Provider in the tree");
//     return useStore(store, selector, equalityFn);
// }
// const RegisterFormProvider = ({ children, ...props }: PropsWithChildren) => {
//     const storeRef = useRef<StoreState>();

//     if (!storeRef.current) {
//         storeRef.current = createFormStore();
//     }

//     return (
//         <FormContext.Provider value={storeRef.current}>
//             {children}
//         </FormContext.Provider>
//     );
// };
