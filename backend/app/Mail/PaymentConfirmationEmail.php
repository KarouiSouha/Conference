<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PaymentConfirmationEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $registration;

    public function __construct($registration)
    {
        $this->registration = $registration;
    }

    public function build()
    {
        $language = $this->registration->language ?? 'fr';
        
        $subject = $language === 'fr' 
            ? 'Confirmation de votre paiement - SITE2025'
            : 'Payment Confirmation - SITE2025';

        return $this->subject($subject)
                    ->view('payment_confirmation')
                    ->with([
                        'first_name' => $this->registration->first_name,
                        'last_name' => $this->registration->last_name,
                        'amount' => $this->registration->amount,
                        'paid_at' => $this->registration->paid_at,
                        'language' => $language,
                        'registration_id' => $this->registration->id,
                    ]);
    }
}