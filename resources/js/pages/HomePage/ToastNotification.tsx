import * as Toast from '@radix-ui/react-toast';

type ToastNotificationProps = {
    openToast: boolean;
    setOpenToast: (open: boolean) => void;
};

export default function ToastNotification({ openToast, setOpenToast }: ToastNotificationProps) {
    return (
        <Toast.Provider>
            <Toast.Root open={openToast}
                className="bg-white/70 backdrop-blur-md p-4 rounded-lg shadow-lg"
                onOpenChange={setOpenToast}>
                <Toast.Title className="font-bold text-lg text-gray-700">Welcome!</Toast.Title>
                <Toast.Description className="text-gray-700">
                    Thank you for choosing NotionFlow. Let’s get started!
                </Toast.Description>
                <Toast.Close className="text-red-500 hover:text-red-700 transition-colors">
                    Close
                </Toast.Close>
            </Toast.Root>

            {/* Pastikan posisinya tepat di atas */}
            <Toast.Viewport
                className="fixed top-20 right-0 m-4 z-50 max-w-xs w-full"
            />
        </Toast.Provider>
    );
}
