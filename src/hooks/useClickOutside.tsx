import { RefObject, useEffect, useRef } from 'react';

const useClickOutside = (elRef: RefObject<HTMLElement>, cb: () => void) => {
    const cbRef = useRef<() => void>();
    cbRef.current = cb;
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const isOutSide =
                elRef?.current &&
                !elRef.current.contains(e.target as HTMLElement) &&
                cbRef?.current;
            if (isOutSide && cbRef?.current) {
                cbRef?.current();
            }
        };
        document.addEventListener('click', handleClickOutside, true);

        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, [cbRef, elRef]);
};

export default useClickOutside;
