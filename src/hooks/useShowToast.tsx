import { toast } from 'sonner';

const useShowToast = () => {
    const showToast = (success: boolean, message: string) => {
        success
            ? toast.success(message, { duration: 1100 })
            : toast.error(message, { duration: 1100, richColors: true });
    };

    return { showToast };
};

export default useShowToast;
