<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $language === 'fr' ? 'Reçu d\'Inscription SITE 2025' : 'SITE 2025 Registration Receipt' }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        .header {
            border-bottom: 2px solid #ccc;
            padding-bottom: 20px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .header h1 {
            font-size: 28px;
            margin: 0;
            color: #1f2937;
        }
        .header .org-info {
            font-size: 12px;
            color: #666;
        }
        .receipt-details {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .detail-row {
            display: flex;
            margin-bottom: 10px;
        }
        .detail-label {
            font-weight: bold;
            width: 150px;
        }
        .detail-value {
            flex: 1;
        }
        .accompanying-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        .accompanying-table th,
        .accompanying-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        .accompanying-table th {
            background-color: #f2f2f2;
        }
        .total-section {
            border-top: 2px solid #ccc;
            padding-top: 15px;
            margin-top: 20px;
        }
        .total-amount {
            font-size: 18px;
            font-weight: bold;
            text-align: right;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ccc;
            padding-top: 15px;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <div>
            <h1>{{ $language === 'fr' ? 'Reçu d\'Inscription SITE 2025' : 'SITE 2025 Registration Receipt' }}</h1>
            <div class="org-info">
                <p>{{ $language === 'fr' ? 'SITE 2025 - Conférence Internationale' : 'SITE 2025 - International Conference' }}</p>
                <p>Contact: contact@site2025.org</p>
            </div>
        </div>
    </div>

    <!-- Receipt Details -->
    <div class="receipt-details">
        <h2>{{ $language === 'fr' ? 'Merci pour votre inscription !' : 'Thank you for your registration!' }}</h2>
        <p><strong>{{ $language === 'fr' ? 'Émis le' : 'Issued on' }}:</strong> {{ $currentDate }}</p>
        
        <div class="detail-row">
            <span class="detail-label">{{ $language === 'fr' ? 'Participant' : 'Participant' }}:</span>
            <span class="detail-value">{{ $firstName }} {{ $lastName }}</span>
        </div>
        
        <div class="detail-row">
            <span class="detail-label">Email:</span>
            <span class="detail-value">{{ $email }}</span>
        </div>
        
        <div class="detail-row">
            <span class="detail-label">{{ $language === 'fr' ? 'Nationalité' : 'Nationality' }}:</span>
            <span class="detail-value">{{ $country === 'Tunisia' ? ($language === 'fr' ? 'Tunisie' : 'Tunisia') : ($language === 'fr' ? 'International' : 'International') }}</span>
        </div>
        
        <div class="detail-row">
            <span class="detail-label">{{ $language === 'fr' ? 'Type de participation' : 'Participation Type' }}:</span>
            <span class="detail-value">{{ $participationType === 'with-article' ? ($language === 'fr' ? 'Avec article' : 'With article') : ($language === 'fr' ? 'Sans article' : 'Without article') }}</span>
        </div>
        
        <div class="detail-row">
            <span class="detail-label">{{ $language === 'fr' ? 'Hébergement' : 'Accommodation' }}:</span>
            <span class="detail-value">{{ $accommodationType === 'with-accommodation' ? ($language === 'fr' ? 'Avec hébergement (2 nuits)' : 'With accommodation (2 nights)') : ($language === 'fr' ? 'Sans hébergement' : 'Without accommodation') }}</span>
        </div>
        
        <div class="detail-row">
            <span class="detail-label">{{ $language === 'fr' ? 'Mode de paiement' : 'Payment Method' }}:</span>
            <span class="detail-value">
                @switch($paymentMethod)
                    @case('bank-transfer')
                        {{ $language === 'fr' ? 'Virement bancaire' : 'Bank Transfer' }}
                        @break
                    @case('administrative-order')
                        {{ $language === 'fr' ? 'Mandat administratif' : 'Administrative Order' }}
                        @break
                    @case('check')
                        {{ $language === 'fr' ? 'Paiement par chèque' : 'Check Payment' }}
                        @break
                    @default
                        {{ $paymentMethod }}
                @endswitch
            </span>
        </div>

        <!-- Accompanying Persons -->
        @if(count($accompanyingPersons) > 0)
            <div style="margin-top: 20px;">
                <strong>{{ $language === 'fr' ? 'Personnes accompagnantes' : 'Accompanying Persons' }}:</strong>
                <table class="accompanying-table">
                    <thead>
                        <tr>
                            <th>{{ $language === 'fr' ? 'Nom' : 'Name' }}</th>
                            <th>{{ $language === 'fr' ? 'Âge' : 'Age' }}</th>
                            <th>{{ $language === 'fr' ? 'Réduction' : 'Discount' }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($accompanyingPersons as $person)
                            <tr>
                                <td>{{ $person['name'] }}</td>
                                <td>{{ $person['age'] }} {{ $language === 'fr' ? 'ans' : 'years' }}</td>
                                <td>{{ isset($person['discount']) ? number_format($person['discount'], 2) . ' TND' : '-' }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @endif

        <!-- Total Section -->
        <div class="total-section">
            <div class="total-amount">
                <strong>{{ $language === 'fr' ? 'Montant total' : 'Total Amount' }}: {{ number_format($totalAmount, 2) }} TND</strong>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <div class="footer">
        <p>{{ $language === 'fr' ? 'Ce reçu est généré automatiquement. Veuillez conserver une copie pour vos archives.' : 'This receipt is generated automatically. Please keep a copy for your records.' }}</p>
    </div>
</body>
</html>