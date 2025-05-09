import { useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import DataTableWrapper, { DataTableWrapperRef } from '@/components/datatables';
import { BreadcrumbItem } from '@/types';
import clsx from 'clsx';
import { Project } from '@/types/Projects';

const columns = (filter: string) => [
  { data: 'reference', title: 'Reference' },
  { data: 'name', title: 'Name' },
  { data: 'description', title: 'Description' },
  {
    data: null,
    title: 'Actions',
    orderable: false,
    searchable: false,
    render: (_: null, __: string, row: unknown) => {
      const project = row as Project;
      let html = '';
      if (filter === 'trashed' || (filter === 'all' && project.trashed)) {
        html += `<button class="btn-restore ml-2 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700" data-id="${project.id}">Restore</button>`;
        html += `<button class="btn-force-delete ml-2 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700" data-id="${project.id}">Force Delete</button>`;
      } else {
        html += `<span class="inertia-link-cell" data-id="${project.id}"></span>`;
        html += `<button class="btn-delete ml-2 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700" data-id="${project.id}">Delete</button>`;
      }
      return html;
    },
  },
];

export default function ProjectIndex({ filter: initialFilter, success }: { filter: string; success?: string }) {
  const breadcrumbs: BreadcrumbItem[] = [{ title: 'Project Management', href: '/projects' }];
  const dtRef = useRef<DataTableWrapperRef>(null);
  const [filter, setFilter] = useState(initialFilter || 'active');

  const handleDelete = (id: string) => {
    router.delete(route('projects.destroy', id), {
      onSuccess: () => dtRef.current?.reload(),
    });
  };

  const handleRestore = (id: number) => {
    router.post(route('projects.restore', id), {}, {
      onSuccess: () => dtRef.current?.reload(),
    });
  };

  const handleForceDelete = (id: number) => {
    router.delete(route('projects.force-delete', id), {
      onSuccess: () => dtRef.current?.reload(),
    });
  };

  const drawCallback = () => {
    // Render Edit link
    document.querySelectorAll('.inertia-link-cell').forEach((cell) => {
      const id = cell.getAttribute('data-id');
      if (id) {
        const root = ReactDOM.createRoot(cell);
        root.render(
          <Link
            href={`/projects/${id}/edit`}
            className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Edit
          </Link>
        );
      }
    });

    // Attach event listener for Delete / Restore / Force Delete
    document.querySelectorAll('.btn-delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (id) handleDelete(String(id));
      });
    });
    document.querySelectorAll('.btn-restore').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (id) handleRestore(Number(id));
      });
    });
    document.querySelectorAll('.btn-force-delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (id) handleForceDelete(Number(id));
      });
    });
  };

  const renderToggleTabs = () => {
    const tabs = ['active', 'trashed', 'all'];
    return (
      <div className="inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={clsx(
              'flex items-center rounded-md px-3.5 py-1.5 transition-colors',
              filter === tab
                ? 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60'
            )}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
    );
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Projects" />
      <div className="px-4 py-6">
        <h1 className="text-2xl font-semibold mb-4">Project Management</h1>
        <div className="col-md-12">
          <HeadingSmall title="Projects" description="Manage application projects" />
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Project List</h2>
            <Link href={route('projects.create')}>
              <Button>Create Project</Button>
            </Link>
          </div>
          <div className="mb-4">{renderToggleTabs()}</div>
          {success && (
            <div className="p-2 mb-2 bg-green-100 text-green-800 rounded">{success}</div>
          )}
          <DataTableWrapper
            key={filter}
            ref={dtRef}
            ajax={{
              url: route('projects.json') + '?filter=' + filter,
              type: 'POST',
            }}
            columns={columns(filter)}
            options={{ drawCallback }}
          />
        </div>
      </div>
    </AppLayout>
  );
}
