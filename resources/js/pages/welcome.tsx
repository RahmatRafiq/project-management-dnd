import { Dialog } from '@radix-ui/react-dialog';
import * as Toast from '@radix-ui/react-toast';
import { useState } from 'react';
import { FaTasks, FaUsers, FaChartBar } from 'react-icons/fa';

export default function Welcome() {
    const [openModal, setOpenModal] = useState(false);
    const [openToast, setOpenToast] = useState(false);

    const toggleModal = () => setOpenModal(!openModal);

    return (
        <div className="font-sans text-gray-900 bg-gray-50">
            {/* Navbar */}
            <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
                <div className="container mx-auto flex justify-between items-center py-4 px-6">
                    <h1 className="text-2xl font-bold text-blue-600">NotionFlow</h1>
                    <nav className="space-x-6">
                        <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
                        <a href="#workflow" className="text-gray-700 hover:text-blue-600 transition-colors">Workflow</a>
                        <a href="#templates" className="text-gray-700 hover:text-blue-600 transition-colors">Templates</a>
                        <a href="#cta" className="text-gray-700 hover:text-blue-600 transition-colors">Get Started</a>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 text-white py-32">
                <div className="container mx-auto text-center">
                    <h1 className="text-6xl font-extrabold tracking-tight">
                        The Happier Workspace
                    </h1>
                    <p className="mt-6 text-xl">
                        Write, plan, and collaborate with ease.
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
            <section id="features" className="py-20 bg-gray-100">
                <div className="container mx-auto text-center">
                    <h2 className="text-5xl font-bold text-gray-800">Build Perfect Docs</h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Capture ideas, manage projects, and collaborate seamlessly.
                    </p>
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[
                            {
                                title: 'Task Management',
                                description: 'Organize and prioritize tasks with ease.',
                                icon: <FaTasks />,
                                image: 'https://placehold.co/400',
                            },
                            {
                                title: 'Team Collaboration',
                                description: 'Communicate and collaborate in real-time.',
                                icon: <FaUsers />,
                                image: 'https://placehold.co/400',
                            },
                            {
                                title: 'Analytics & Insights',
                                description: 'Track progress and make data-driven decisions.',
                                icon: <FaChartBar />,
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

            {/* Workflow Section */}
            <section id="workflow" className="py-20 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                <div className="container mx-auto text-center">
                    <h2 className="text-5xl font-bold">Your Workflow, Your Way</h2>
                    <p className="mt-4 text-lg">
                        All your projects, tasks, and notes in one place.
                    </p>
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        <div className="p-8 bg-white text-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                            <h3 className="text-2xl font-bold">Customizable Views</h3>
                            <p className="mt-4">Tailor your workspace to fit your needs.</p>
                        </div>
                        <div className="p-8 bg-white text-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                            <h3 className="text-2xl font-bold">Automation</h3>
                            <p className="mt-4">Automate repetitive tasks and save time.</p>
                        </div>
                        <div className="p-8 bg-white text-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                            <h3 className="text-2xl font-bold">Knowledge Management</h3>
                            <p className="mt-4">Find everything you need instantly.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Templates Section */}
            <section id="templates" className="py-20 bg-gray-100">
                <div className="container mx-auto text-center">
                    <h2 className="text-5xl font-bold text-gray-800">Start with a Template</h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Build anything with our pre-designed templates.
                    </p>
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        <div className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                            <h3 className="text-2xl font-bold">Project Roadmap</h3>
                        </div>
                        <div className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                            <h3 className="text-2xl font-bold">Meeting Notes</h3>
                        </div>
                        <div className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                            <h3 className="text-2xl font-bold">Content Calendar</h3>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section id="cta" className="py-20 bg-gradient-to-r from-green-400 to-blue-500 text-white">
                <div className="container mx-auto text-center">
                    <h2 className="text-5xl font-bold">Get Started Today</h2>
                    <p className="mt-4 text-lg">
                        Join thousands of teams who trust NotionFlow.
                    </p>
                    <button
                        onClick={() => setOpenToast(true)}
                        className="mt-10 px-8 py-4 bg-white text-green-500 font-semibold rounded-full shadow-lg hover:scale-105 transition-transform"
                    >
                        Get Started
                    </button>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="bg-gray-900 text-gray-400 py-10">
                <div className="container mx-auto text-center">
                    <p>© 2025 NotionFlow. All Rights Reserved.</p>
                </div>
            </footer>

            {/* Modal Component */}
            {openModal && (
                <Dialog open={openModal} onOpenChange={setOpenModal}>
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
            )}

            {/* Toast Notification */}
            <Toast.Provider>
                <Toast.Root open={openToast} onOpenChange={setOpenToast}>
                    <Toast.Title className="font-bold text-lg">Welcome!</Toast.Title>
                    <Toast.Description className="text-gray-700">
                        Thank you for choosing NotionFlow. Let’s get started!
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