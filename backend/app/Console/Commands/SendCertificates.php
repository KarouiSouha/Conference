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
            $this->generateAndSend($p->first_name . ' ' . $p->last_name, $p->email);
        }

        foreach ($speakers as $s) {
            $this->generateAndSend($s->name, $s->email);
        }

        // Vider le dossier après envoi
        $this->clearCertsDirectory();

        $this->info('All certificates sent and directory cleared!');
    }

    private function clearCertsDirectory()
    {
        $certsPath = storage_path('app/public/certs');

        $files = glob($certsPath . '/*'); // Récupère tous les fichiers du dossier

        foreach ($files as $file) {
            if (is_file($file)) {
                unlink($file); // Supprime chaque fichier
            }
        }
    }


    private function generateAndSend($name, $email)
    {
        $template = public_path("certificates/certificate_en.png");
        $image = Image::read($template);

        $image->text($name, 970, 750, function ($font) {
            $font->file(public_path('fonts/ARIAL.TTF')); // Change if you have another font
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
