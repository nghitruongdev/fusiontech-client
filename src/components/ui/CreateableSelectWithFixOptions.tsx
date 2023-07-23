import React from "react";
import { GroupBase, OptionsOrGroups, StylesConfig } from "react-select";
import makeAnimated from "react-select/animated";
import AsyncCreatableSelect, {
    AsyncCreatableProps,
} from "react-select/async-creatable";
type Props = {} & AsyncCreatableProps<unknown, true, GroupBase<unknown>>;
const CreateableSelectWithFixedOptions = React.forwardRef(
    ({ ...props }: Props, ref) => {
        // const animatedComponents = makeAnimated();

        // const styles: StylesConfig<ColourOption, true> = {
        //     multiValue: (base, state) => {
        //         return state.data.isFixed
        //             ? { ...base, backgroundColor: "gray" }
        //             : base;
        //     },
        //     multiValueLabel: (base, state) => {
        //         return state.data.isFixed
        //             ? {
        //                   ...base,
        //                   fontWeight: "bold",
        //                   color: "white",
        //                   paddingRight: 6,
        //               }
        //             : base;
        //     },
        //     multiValueRemove: (base, state) => {
        //         return state.data.isFixed ? { ...base, display: "none" } : base;
        //     },
        // };

        // const orderOptions = (values: readonly ColourOption[]) => {
        //     return values
        //         .filter((v) => v.isFixed)
        //         .concat(values.filter((v) => !v.isFixed));
        // };
        // const onChange = (
        //     newValue: OnChangeValue<ColourOption, true>,
        //     actionMeta: ActionMeta<ColourOption>,
        // ) => {
        //     switch (actionMeta.action) {
        //         case "remove-value":
        //         case "pop-value":
        //             if (actionMeta.removedValue.isFixed) {
        //                 return;
        //             }
        //             break;
        //         case "clear":
        //             newValue = colourOptions.filter((v) => v.isFixed);
        //             break;
        //     }

        //     setValue(orderOptions(newValue));
        // };
        return (
            <AsyncCreatableSelect
                cacheOptions
                defaultOptions
                isMulti
                ref={ref as any}
                formatCreateLabel={(input) => `+ ${input}`}
                isSearchable
                // loadOptions={promiseOptions}
                {...props}
            />
        );
    },
);
export default CreateableSelectWithFixedOptions;
