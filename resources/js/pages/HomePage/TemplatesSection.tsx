// src/HomePage/TemplatesSection.tsx
import * as Popover from '@radix-ui/react-popover';
import { Transition } from '@headlessui/react';
import { Fragment } from 'react';

const templates = [
  {
    id: 'roadmap',
    title: 'Project Roadmap',
    description: 'Visualize milestones and timelines for your projects.',
    previewImg: 'https://placehold.co/300x200',
  },
  {
    id: 'meeting-notes',
    title: 'Meeting Notes',
    description: 'Take structured notes and action items in real-time.',
    previewImg: 'https://placehold.co/300x200',
  },
  {
    id: 'content-calendar',
    title: 'Content Calendar',
    description: 'Plan and schedule your content across channels.',
    previewImg: 'https://placehold.co/300x200',
  },
];

export default function TemplatesSection() {
  return (
    <section id="templates" className="py-20 bg-gray-100 relative">
      <div className="container mx-auto text-center">
        <h2 className="text-5xl font-bold text-gray-800">Start with a Template</h2>
        <p className="mt-4 text-lg text-gray-600">
          Build anything faster with our high-quality pre-designed layouts.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {templates.map((tpl) => (
            <Popover.Root key={tpl.id}>
              <Popover.Trigger asChild>
                <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow cursor-pointer">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {tpl.title}
                  </h3>
                </div>
              </Popover.Trigger>

              <Popover.Portal>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Popover.Content
                    align="center"
                    side="top"
                    sideOffset={8}
                    className="z-50 w-80 bg-white rounded-lg shadow-xl ring-1 ring-black/5 overflow-hidden"
                  >
                    <img
                      src={tpl.previewImg}
                      alt={`${tpl.title} preview`}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4 text-left">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {tpl.title}
                      </h4>
                      <p className="mt-2 text-gray-600">{tpl.description}</p>
                      <button
                        className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                      >
                        Use Template
                      </button>
                    </div>
                    <Popover.Arrow className="fill-white" />
                  </Popover.Content>
                </Transition>
              </Popover.Portal>
            </Popover.Root>
          ))}
        </div>
      </div>
    </section>
  );
}
