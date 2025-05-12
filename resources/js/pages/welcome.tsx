// src/pages/Welcome.tsx
import { useState } from 'react';
import Navbar from './HomePage/Navbar';
import HeroSection from './HomePage/HeroSection';
import FeaturesSection from './HomePage/FeaturesSection';
import WorkflowSection from './HomePage/WorkflowSection';
import TemplatesSection from './HomePage/TemplatesSection';
import CTASection from './HomePage/CTASection';
import ModalDialog from './HomePage/ModalDialog';
import ToastNotification from './HomePage/ToastNotification';
import Footer from './HomePage/Footer';

export default function Welcome() {
    const [openModal, setOpenModal] = useState(false);
    const [openToast, setOpenToast] = useState(false);

    const toggleModal = () => setOpenModal(!openModal);

    return (
        <div className="font-sans text-gray-900 bg-gray-50">
            <Navbar />
            <HeroSection />
            <FeaturesSection />
            <WorkflowSection />
            <TemplatesSection />
            <CTASection />
            <Footer />
            <ModalDialog openModal={openModal} toggleModal={toggleModal} />
            <ToastNotification openToast={openToast} setOpenToast={setOpenToast} />
        </div>
    );
}
