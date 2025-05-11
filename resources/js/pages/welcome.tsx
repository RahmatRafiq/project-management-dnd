import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Dialog } from '@radix-ui/react-dialog';
import * as Toast from '@radix-ui/react-toast';
import { useState } from 'react';
import { FaRocket, FaLightbulb, FaChartLine } from 'react-icons/fa';

export default function Welcome() {
    usePage<SharedData>();

    const [openModal, setOpenModal] = useState(false);
    const [openToast, setOpenToast] = useState(false);

    const toggleModal = () => {
        setOpenModal(!openModal);
    };

    return (
        <div className="font-sans text-gray-900 bg-gray-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 text-white py-20">
                <div className="container mx-auto text-center">
                    <h1 className="text-6xl font-extrabold tracking-tight">
                        Empower Your Business
                    </h1>
                    <p className="mt-6 text-xl">
                        Discover innovative solutions to take your business to the next level.
                    </p>
                    <button
                        onClick={toggleModal}
                        className="mt-10 px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-full shadow-lg hover:scale-105 transition-transform"
                    >
                        Learn More
                    </button>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black opacity-20 pointer-events-none"></div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-100">
                <div className="container mx-auto text-center">
                    <h2 className="text-5xl font-bold text-gray-800">Why Choose Us?</h2>
                    <p className="mt-4 text-lg text-gray-600">
                        We provide cutting-edge solutions tailored to your needs.
                    </p>
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[
                            {
                                title: 'Innovative Solutions',
                                description:
                                    'We deliver creative and effective solutions to complex problems.',
                                icon: <FaRocket />,
                                image: 'https://placehold.co/400',
                            },
                            {
                                title: 'Customer Focused',
                                description:
                                    'Our team is dedicated to providing the best customer experience.',
                                icon: <FaLightbulb />,
                                image: 'https://placehold.co/400',
                            },
                            {
                                title: 'Proven Results',
                                description:
                                    'We ensure measurable and impactful outcomes for your business.',
                                icon: <FaChartLine />,
                                image: 'https://placehold.co/400',
                            },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <img
                                    src={feature.image}
                                    alt={feature.title}
                                    className="w-full h-32 object-cover rounded-lg mb-6"
                                />
                                <div className="text-5xl text-blue-500">{feature.icon}</div>
                                <h3 className="mt-6 text-2xl font-semibold">{feature.title}</h3>
                                <p className="mt-4 text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                <div className="container mx-auto text-center">
                    <h2 className="text-5xl font-bold">What Our Clients Say</h2>
                    <div className="mt-12 space-y-8">
                        {[
                            {
                                text: '“Amazing service! The team was fantastic and our results speak for themselves.”',
                                client: 'Client 1',
                            },
                            {
                                text: '“They truly helped us grow our business with their tailored solutions.”',
                                client: 'Client 2',
                            },
                        ].map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-white text-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <p className="text-lg font-semibold">{testimonial.text}</p>
                                <p className="mt-4 text-gray-600">- {testimonial.client}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-20 bg-gradient-to-r from-green-400 to-blue-500 text-white">
                <div className="container mx-auto text-center">
                    <h2 className="text-5xl font-bold">Ready to Get Started?</h2>
                    <p className="mt-4 text-lg">
                        Join thousands of businesses that trust us to deliver results.
                    </p>
                    <button
                        onClick={() => setOpenToast(true)}
                        className="mt-10 px-8 py-4 bg-white text-green-500 font-semibold rounded-full shadow-lg hover:scale-105 transition-transform"
                    >
                        Contact Us
                    </button>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="bg-gray-900 text-gray-400 py-10">
                <div className="container mx-auto text-center">
                    <p>© 2025 Your Company. All Rights Reserved.</p>
                </div>
            </footer>

            {/* Modal Component */}
            {openModal && (
                <Dialog open={openModal} onOpenChange={setOpenModal}>
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-8 rounded-lg max-w-lg w-full shadow-lg">
                            <h2 className="text-2xl font-bold">Learn More About Us</h2>
                            <p className="mt-4 text-gray-600">
                                Here at Our Company, we focus on providing innovative solutions that push the
                                boundaries and make a significant impact on businesses like yours.
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
            )}

            {/* Toast Notification */}
            <Toast.Provider>
                <Toast.Root open={openToast} onOpenChange={setOpenToast}>
                    <Toast.Title className="font-bold text-lg">Success</Toast.Title>
                    <Toast.Description className="text-gray-700">
                        Welcome to our landing page! We are happy to have you here.
                    </Toast.Description>
                    <Toast.Close className="text-red-500 hover:text-red-700 transition-colors">
                        Close
                    </Toast.Close>
                </Toast.Root>
                <Toast.Viewport className="fixed bottom-0 right-0 m-4" />
            </Toast.Provider>
        </div>
    );
}