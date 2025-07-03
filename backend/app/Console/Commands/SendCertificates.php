<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Registration;
use App\Models\Speaker;
use Illuminate\Support\Facades\Mail;
use Intervention\Image\Laravel\Facades\Image;
use Illuminate\Support\Facades\Storage;

class SendCertificates extends Command
{
    protected $signature = 'certificates:send';
    protected $description = 'Send certificates to participants and speakers';

    public function handle()
    {
        $participants = Registration::all();
        $speakers = Speaker::all();

        foreach ($participants as $p) {
            $this->generateAndSend($p->firstName . ' ' . $p->lastName, $p->email, $p->language);
        }

        foreach ($speakers as $s) {
            $this->generateAndSend($s->name, $s->email, $s->language);
        }

        $this->info('All certificates sent!');
    }

    private function generateAndSend($name, $email, $lang)
    {
        $template = public_path("certificates/certificate_{$lang}.png");
        $image = Image::make($template);

        $image->text($name, 860, 700, function ($font) {
            $font->file(public_path('fonts/ARIAL.ttf')); // Change if you have another font
            $font->size(48);
            $font->color('#000000');
            $font->align('center');
        });

        $filename = 'cert_' . uniqid() . '.png';
        $path = storage_path("app/public/certs/" . $filename);
        $image->save($path);

        Mail::send([], [], function ($message) use ($email, $path) {
            $message->to($email)
                    ->subject('Your Participation Certificate')
                    ->attach($path);
        });
    }
}
