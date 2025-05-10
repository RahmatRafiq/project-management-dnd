<?php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AdminTaskActivityNotification extends Notification
{
    use Queueable;

    protected $activity;

    public function __construct($activity)
    {
        $this->activity = $activity;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        $causerName = optional($this->activity->causer)->name ?? 'System';
        $taskTitle  = optional($this->activity->subject)->title ?? '(untitled)';

        return (new MailMessage)
            ->subject('Aktivitas Task')
            ->line("{$causerName} melakukan aktivitas pada Task: {$taskTitle}")
            ->line("Deskripsi: {$this->activity->description}")
            ->action('Lihat Detail', url('/admin/tasks/' . $this->activity->subject_id))
            ->line('Terima kasih.');
    }

    public function toDatabase($notifiable)
    {
        return [
            'activity_id'  => $this->activity->id,
            'description'  => $this->activity->description,
            'subject_type' => $this->activity->subject_type,
            'subject_id'   => $this->activity->subject_id,
            'properties'   => $this->activity->properties,
            'causer_id'    => $this->activity->causer_id,
            'causer_name'  => optional($this->activity->causer)->name,
        ];
    }

}
