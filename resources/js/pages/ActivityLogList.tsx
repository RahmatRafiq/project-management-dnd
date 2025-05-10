import { useRef, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import DataTableWrapper, { DataTableWrapperRef } from '@/components/datatables';
import '@/echo';

interface ActivityLog {
  id: number;
  description: string;
  subject_type: string;
  event: string;
  causer_name: string;
  causer_id: number;
  created_at: string;
}
declare global {
  interface Window {
    Echo: {
      channel: (channelName: string) => {
        listen: (eventName: string, callback: (data: ActivityLog) => void) => void;
      };
      leave: (channelName: string) => void;
    };
  }
}
type Subject = 'User' | 'Project' | 'Task';

interface DataTableRequest extends Record<string, unknown> {
  subject?: Subject;
  filterEvent?: string;
}

export default function ActivityLogList() {
  const userRef = useRef<DataTableWrapperRef>(null);
  const projectRef = useRef<DataTableWrapperRef>(null);
  const taskRef = useRef<DataTableWrapperRef>(null);

  useEffect(() => {
    const channel = window.Echo.channel('activity-logs');
    const onEvent = (data: ActivityLog) => {
      const model = data.subject_type.split('\\').pop();
      if (model === 'User') userRef.current?.reload();
      if (model === 'Project') projectRef.current?.reload();
      if (model === 'Task') taskRef.current?.reload();
    };
    channel.listen('ActivityLogCreated', onEvent);
    return () => void window.Echo.leave('activity-logs');
  }, []);

  function buildConfig(subject: Subject) {
    return {
      ajax: {
        url: route('activity-logs.json'),
        type: 'POST' as const,
        data: (d: DataTableRequest) => {
          d.subject = subject;
          d.filterEvent = 'all';
        }
      },
      columns: [
        { data: 'created_at', title: 'Waktu' },
        { data: 'causer_name', title: 'User' },
        { data: 'description', title: 'Deskripsi' },
        {
          data: 'event',
          title: 'Event',
          render: (data: null) => {
            const evt = String(data); 
            const base = 'px-2 inline-flex text-xs font-semibold rounded-full';
            let classes = '';
            switch (evt) {
              case 'created':
                classes = 'bg-green-100 text-green-800';
                break;
              case 'updated':
                classes = 'bg-yellow-100 text-yellow-800';
                break;
              case 'deleted':
                classes = 'bg-red-100 text-red-800';
                break;
              default:
                classes = 'bg-gray-100 text-gray-800';
            }
            return `<span class="${base} ${classes}">${evt}</span>`;
          }
        },
      ],
      options: {
        serverSide: true,
        processing: true,
        searching: true,
        ordering: false,
        lengthMenu: [5, 10, 20] as const,
      }
    };
  }

  return (
    <AppLayout breadcrumbs={[{ title: 'Activity Logs', href: '/dashboard/activity-logs' }]}>
      <Head title="Activity Logs by Model" />
      <div className="px-4 py-6 space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-3">User Activity</h2>
          <DataTableWrapper ref={userRef} {...buildConfig('User')} />
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-3">Project Activity</h2>
          <DataTableWrapper ref={projectRef} {...buildConfig('Project')} />
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-3">Task Activity</h2>
          <DataTableWrapper ref={taskRef} {...buildConfig('Task')} />
        </section>
      </div>
    </AppLayout>
  );
}
