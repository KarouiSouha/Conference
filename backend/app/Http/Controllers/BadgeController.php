<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Dompdf\Dompdf;
use Dompdf\Options;
use Barryvdh\Snappy\Facades\SnappyPdf;
use Illuminate\Support\Facades\DB;

class BadgeController extends Controller
{
    public function downloadBadge(Request $request, $id)
    {
        $name = $request->query('name', 'Participant');

        $pdf = SnappyPdf::loadView('badge', ['name' => $name])
            ->setPaper('a4')
            ->setOption('enable-local-file-access', true); // important pour que wkhtmltopdf accède à l’image

        return $pdf->stream('badge_SITE2025.pdf');
    }
}