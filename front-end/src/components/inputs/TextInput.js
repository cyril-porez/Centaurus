import { useState } from 'react' 

export default function TextInput({ props, ...rest }) {
    const [value, setValue] = useState(null);

    const handleChange = (event) => {
        setValue(event.target.value);
    }

    const {
        placeholder,
        id,
        inputType,
        legend
    } = props;

    return (
        <fieldset 
            className={`
                w-5/6 
                my-2 mx-auto 
                border-[${props.color}] 
                rounded-full 
                border 
                px-8 
            `}>
            {legend ? 
                <legend className={`px-2 text-[${props.color}]`}>
                    {legend}
                </legend> :
                null
            }
            <input
                className='mb-2 py-1 w-full'
                type={inputType}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                id={id}
            />
        </fieldset>
    );
}