import { useState } from 'react';
import ModalDialog from './ModalDialog';
import ToastNotification from './ToastNotification';

export default function HeroSection() {
  const [openModal, setOpenModal] = useState(false);
  const [openToast, setOpenToast] = useState(false);

  const toggleModal = () => setOpenModal(!openModal);

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 text-white py-32">
      <div className="container mx-auto text-center">
        <h1 className="text-6xl font-extrabold tracking-tight">
          The Happier Workspace
        </h1>
        <p className="mt-6 text-xl">Write, plan, and collaborate with ease.</p>
        <button
          onClick={toggleModal}
          className="mt-10 px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          Learn More
        </button>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black opacity-20 pointer-events-none"></div>

      <ModalDialog openModal={openModal} toggleModal={toggleModal} />
      <ToastNotification openToast={openToast} setOpenToast={setOpenToast} />
    </section>
  );
}
