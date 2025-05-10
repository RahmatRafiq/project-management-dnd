<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class AdminProjectActivityNotification extends Notification
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
        return (new MailMessage)
            ->subject('Aktivitas Project Baru')
            ->line('Ada perubahan data pada project.')
            ->line("Deskripsi: {$this->activity->description}")
            ->action('Lihat Detail', url('/admin/projects'))
            ->line('Terima kasih.');
    }

    public function toDatabase($notifiable)
    {
        return [
            'activity_id' => $this->activity->id,
            'description' => $this->activity->description,
            'subject_type' => $this->activity->subject_type,
            'subject_id' => $this->activity->subject_id,
            'properties' => $this->activity->properties,
        ];
    }
}
