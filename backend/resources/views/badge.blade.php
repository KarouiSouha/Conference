<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        @page {
            size: A4;
            margin: 0;
        }
        body {
            margin: 0;
            padding: 0;
            font-family: sans-serif;
        }
        .page {
            page-break-after: always;
            width: 210mm;
            height: 297mm;
            position: relative;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 0;
        }
        .badge-image {
            width: 210mm;
            height: 297mm;
            object-fit: cover;
            position: absolute;
            top: 0;
            left: 0;
        }
        .name-overlay {
            position: absolute;
            top: 65%; /* Position ajustée pour être sous "participant" */
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 32px;
            font-weight: bold;
            color: #000;
            z-index: 10;
        }
        .page-3 {
            padding: 0;
        }
        .full-page-image {
            width: 210mm;
            height: 297mm;
            object-fit: cover;
            position: absolute;
            top: 0;
            left: 0;
        }
    </style>
</head>
<body>
<!-- Page 1 (badge avec nom personnalisé) -->
<div class="page">
    @if($language === 'fr')
        <img class="badge-image" src="{{ public_path('badges/1FR.png') }}" alt="Image FR">
    @else
        <img class="badge-image" src="{{ public_path('badges/1EN.png') }}" alt="Image EN">
    @endif
    <div class="name-overlay">{{ $nom }}</div>
</div>

<!-- Page 2 (image pleine page en fonction de la langue) -->
<div class="page-3">
    @if($language === 'fr')
        <img class="full-page-image" src="{{ public_path('badges/2FR.png') }}" alt="Image FR">
    @else
        <img class="full-page-image" src="{{ public_path('badges/2EN.png') }}" alt="Image EN">
    @endif
</div>
</body>
</html>