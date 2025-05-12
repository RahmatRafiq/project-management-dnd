// src/HomePage/FeaturesSection.tsx
import { Tab } from '@headlessui/react';
import { Transition } from '@headlessui/react';
import { FaChartBar, FaTasks, FaUsers } from 'react-icons/fa';
import { useState, Fragment } from 'react';

const features = [
  { id: 'tab-1', title: 'Task Management', description: 'Organize and prioritize tasks with ease.', icon: <FaTasks />, image: 'https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?auto=format&fit=crop&w=600&q=80' },
  { id: 'tab-2', title: 'Team Collaboration', description: 'Communicate and collaborate in real-time.', icon: <FaUsers />, image: 'https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?auto=format&fit=crop&w=600&q=80' },
  { id: 'tab-3', title: 'Analytics & Insights', description: 'Track progress and make data-driven decisions.', icon: <FaChartBar />, image: 'https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?auto=format&fit=crop&w=600&q=80' },
  { id: 'tab-4', title: 'Custom Workflows', description: 'Create workflows tailored to your needs.', icon: <FaTasks />, image: 'https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?auto=format&fit=crop&w=600&q=80' },
  { id: 'tab-5', title: 'Real-Time Updates', description: 'Stay updated with real-time notifications.', icon: <FaUsers />, image: 'https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?auto=format&fit=crop&w=600&q=80' },
  { id: 'tab-6', title: 'Advanced Reporting', description: 'Generate detailed reports effortlessly.', icon: <FaChartBar />, image: 'https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?auto=format&fit=crop&w=600&q=80' },
];

const groups = [
  { id: 'group-1', items: features.slice(0, 3) },
  { id: 'group-2', items: features.slice(3, 6) },
];

export default function FeaturesSection() {
  const [selectedGroup, setSelectedGroup] = useState(0);

  return (
    <section
      id="features"
      className="relative py-20 bg-gray-100 dark:bg-gray-800 overflow-hidden transition-colors"
    >
      <div className="absolute inset-0 bg-gray-100 bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-30 backdrop-blur-md pointer-events-none" />

      <div className="relative container mx-auto text-center">
        <h2 className="text-5xl font-extrabold text-gray-800 dark:text-gray-100">
          Build Perfect Docs
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Capture ideas, manage projects, and collaborate seamlessly.
        </p>

        <Tab.Group selectedIndex={selectedGroup} onChange={setSelectedGroup}>
          <Tab.List className="mt-12 inline-flex space-x-2 bg-gray-200 dark:bg-gray-700 p-1 rounded-full">
            {groups.map((_, idx) => (
              <Tab
                key={idx}
                className={({ selected }) =>
                  `px-4 py-2 text-sm font-medium rounded-full transition-colors ${selected
                    ? 'bg-white dark:bg-gray-900 text-indigo-600 shadow'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-900/50'
                  }`
                }
              >
                Page {idx + 1}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-8 px-4">
            {groups.map((group, gi) => (
              <Tab.Panel key={group.id} className="focus:outline-none">
                <Transition
                  show={selectedGroup === gi}
                  as={Fragment}
                  enter="transition ease-out duration-400"
                  enterFrom="opacity-0 translate-y-4"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 -translate-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {group.items.map((feat) => (
                      <div
                        key={feat.id}
                        className="flex flex-col w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden transition-colors"
                      >
                        <img
                          src={feat.image}
                          alt={feat.title}
                          className="w-full h-48 object-cover flex-shrink-0"
                        />
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="text-6xl text-indigo-600 mb-4">
                            {feat.icon}
                          </div>
                          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                            {feat.title}
                          </h3>
                          <p className="mt-2 text-gray-600 dark:text-gray-300 flex-1">
                            {feat.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Transition>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </section>
  );
}
