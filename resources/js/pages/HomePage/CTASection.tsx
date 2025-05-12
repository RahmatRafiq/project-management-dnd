import { useState } from 'react';
import ToastNotification from './ToastNotification'; // Mengimpor komponen ToastNotification

export default function CTASection() {
    const [openToast, setOpenToast] = useState(false);

    return (
        <section
            id="cta"
            className="py-20 bg-gradient-to-r from-green-400 to-blue-500 text-white relative overflow-hidden"
        >
            {/* Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-blue-700 opacity-30 transform scale-110 z-0" />
            
            <div className="container mx-auto text-center relative z-10">
                <h2 className="text-5xl font-bold tracking-tight leading-tight text-white mb-4">
                    Get Started Today
                </h2>
                <p className="mt-4 text-lg font-medium text-white opacity-80">
                    Join thousands of teams who trust NotionFlow. Start building your future.
                </p>

                <button
                    onClick={() => setOpenToast(true)}
                    className="mt-10 px-8 py-4 bg-white text-green-500 font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-300 ease-out transform hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-300"
                >
                    Get Started
                </button>

                {/* Toast Notification */}
                {openToast && <ToastNotification openToast={openToast} setOpenToast={setOpenToast} />}
            </div>
        </section>
    );
}
