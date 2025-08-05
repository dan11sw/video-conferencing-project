import { useEffect } from 'react';

const useBeforeUnload = (value: any) => {
    const handleBeforeUnload = (e: any) => {
        let returnValue;

        if(typeof value === 'function') {
            returnValue = value(e);
        }else {
            returnValue = value;
        }

        if(returnValue){
            e.preventDefault();
            e.returnValue = returnValue;
        }

        return returnValue;
    }

    useEffect(() => {
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);
};

export default useBeforeUnload;