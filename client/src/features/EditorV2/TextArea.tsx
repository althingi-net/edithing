import { FC, Ref, forwardRef, useCallback, useEffect, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import './TextArea.css';

interface Props {
    placeholder?: string;
    onChange?: (value: string) => void;
    value?: string;
    ref?: Ref<HTMLDivElement>;
    className?: string;
}

/**
 * A text area component that simulates a controlled textarea element using contentEditable. Size adjusts automatically to content.
 */
const TextArea: FC<Props> = forwardRef<HTMLDivElement, Props>((props, outerRef) => {
    const { placeholder, onChange, value, className } = props;
    const innerRef = useRef<HTMLDivElement>(null);
    const initialValue = useRef(value);

    const handleInput = useCallback((event: React.FormEvent<HTMLDivElement>) => {
        const newText = event.currentTarget.innerText;

        if (innerRef.current) {
            innerRef.current.textContent = newText;
        }

        if (onChange) {
            onChange(newText);
        }
    }, [onChange]);

    useEffect(() => {
        if (value && innerRef.current) {
            innerRef.current.textContent = value;
        }
    }, [value]);
      
    return (
        <>
            <div
                className={['text-area', className].join(' ')}
                contentEditable='plaintext-only'
                data-placeholder={placeholder}
                suppressContentEditableWarning
                onInput={handleInput}
                ref={mergeRefs([outerRef, innerRef])}
                dangerouslySetInnerHTML={{ __html: initialValue.current ?? '' }}
            />
        </>
    );
});

TextArea.displayName = 'TextArea';

export default TextArea;