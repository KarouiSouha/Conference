<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RegistrationConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public $nom;
    public $url;
    public $language;
    public $registrationId; // Ajouter cette propriété

    public function __construct($nom, $url, $language, $registrationId = null)
    {
        $this->nom = $nom;
        $this->url = $url;
        $this->language = $language;
        $this->registrationId = $registrationId; // Initialiser la propriété
    }

    /**
     * Get the message envelope.
     *
     * @return \Illuminate\Mail\Mailables\Envelope
     */
    public function envelope()
    {
        $subject = $this->language === 'fr'
            ? 'Confirmation d\'inscription'
            : 'Registration Confirmation';

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     *
     * @return \Illuminate\Mail\Mailables\Content
     */
    public function content()
    {
        return new Content(
            html: 'emailViewINscription',
            with: [
                'nom' => $this->nom,
                'url' => $this->url,
                'language' => $this->language,
                'registrationId' => $this->registrationId, // Passer l'ID à la vue
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array
     */
    public function attachments()
    {
        return [];
    }
}