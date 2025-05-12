import { Dialog } from '@radix-ui/react-dialog';

type ModalDialogProps = {
    openModal: boolean;
    toggleModal: () => void;
};

export default function ModalDialog({ openModal, toggleModal }: ModalDialogProps) {
    return (
        openModal && (
            <Dialog open={openModal} onOpenChange={toggleModal}>
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg max-w-lg w-full shadow-lg">
                        <h2 className="text-2xl font-bold">Learn More About NotionFlow</h2>
                        <p className="mt-4 text-gray-600">
                            NotionFlow is your all-in-one solution for managing tasks, collaborating with your team, and tracking progress.
                        </p>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={toggleModal}
                                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </Dialog>
        )
    );
}
