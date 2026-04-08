import { useState, useCallback } from 'react';

const useFormValidation = (initialValues, validate) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState(validate ? validate(initialValues) : {});
    const [touched, setTouched] = useState({});

    const handleChange = useCallback((e) => {
        let { name, value } = e.target;
        if (name === 'email') {
            value = value.toLowerCase();
        }
        setValues((prev) => ({ ...prev, [name]: value }));
        
        // Real-time validation
        if (validate) {
            const validationErrors = validate({ ...values, [name]: value });
            setErrors(validationErrors);
        }
    }, [values, validate]);

    const handleBlur = useCallback((e) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        
        if (validate) {
            const validationErrors = validate(values);
            setErrors(validationErrors);
        }
    }, [values, validate]);

    const isValid = Object.keys(errors).length === 0;

    const resetForm = () => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
    };

    const getFieldProps = (name) => ({
        name,
        value: values[name],
        onChange: handleChange,
        onBlur: handleBlur,
        className: `
            ${touched[name] && errors[name] ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
            ${touched[name] && !errors[name] ? 'border-green-500 focus:ring-green-500 focus:border-green-500' : ''}
        `
    });

    return {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        isValid,
        setValues,
        resetForm,
        getFieldProps
    };
};

export default useFormValidation;
