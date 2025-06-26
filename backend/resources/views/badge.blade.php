<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        @page {
            margin: 0;
        }
        body {
            margin: 0;
            padding: 0;
            font-family: sans-serif;
        }
        .page {
            page-break-after: always;
            width: 100vw;
            height: 100vh;
            position: relative;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding-top: 55px; /* Décale l'image vers le bas pour qu'elle soit visible en haut */
        }
        .badge-image {
            width: 100%;
            max-width: 700px; /* Légèrement réduit pour assurer la visibilité complète */
            position: relative;
        }
        .name-overlay {
            position: absolute;
            top: 45%; /* Position ajustée pour être sous "participant" */
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
            width: 100vw;
            height: 100vh;
            object-fit: cover;
        }
    </style>
</head>
<body>
<!-- Page 1 (badge avec nom personnalisé) -->
<div class="page">
    <div style="position: relative; display: inline-block;">
        <img src="{{ public_path('badges/challenger_badge.png') }}" class="badge-image" alt="Badge">
        <div class="name-overlay">{{ $nom }}</div>
    </div>
</div>

<!-- Page 2 (image pleine page) -->
<div class="page">
    <img class="full-page-image" src="{{ public_path('badges/2.png') }}" alt="Image pleine page">
</div>
</body>
</html>