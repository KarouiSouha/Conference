<!DOCTYPE html>
<html lang="{{ $language }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $language === 'fr' ? 'Reçu d\'inscription SITE 2025' : 'SITE 2025 Registration Receipt' }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #2d3748;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 650px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
            position: relative;
        }

        .container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
            0%, 100% { opacity: 0.5; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
        }

        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.2);
            position: relative;
            z-index: 1;
        }

        .header p {
            font-size: 16px;
            opacity: 0.95;
            font-weight: 300;
            position: relative;
            z-index: 1;
        }

        .header .date {
            margin-top: 15px;
            padding: 8px 20px;
            background: rgba(255,255,255,0.2);
            border-radius: 25px;
            display: inline-block;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.3);
        }

        .content {
            padding: 40px 30px;
        }

        .greeting {
            font-size: 18px;
            color: #4a5568;
            margin-bottom: 20px;
            font-weight: 500;
        }

        .intro-text {
            color: #718096;
            margin-bottom: 30px;
            font-size: 16px;
            line-height: 1.7;
        }

        .info-section {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border-radius: 16px;
            padding: 30px;
            margin: 25px 0;
            border: 1px solid rgba(203, 213, 224, 0.5);
            position: relative;
            overflow: hidden;
        }

        .info-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .info-section h3 {
            color: #2d3748;
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
        }

        .info-section h3::before {
            content: '📋';
            margin-right: 10px;
            font-size: 18px;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding: 12px 0;
            border-bottom: 1px solid rgba(203, 213, 224, 0.6);
            transition: all 0.3s ease;
        }

        .info-row:last-child {
            border-bottom: none;
        }

        .info-row:hover {
            background: rgba(255,255,255,0.7);
            margin: 15px -15px;
            padding: 12px 15px;
            border-radius: 8px;
        }

        .info-label {
            font-weight: 600;
            color: #4a5568;
            font-size: 15px;
        }

        .info-value {
            color: #2d3748;
            font-weight: 500;
            text-align: right;
            max-width: 60%;
        }

        .accompanying-section {
            margin-top: 30px;
            background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
            border-radius: 16px;
            padding: 25px;
            border: 1px solid rgba(254, 215, 215, 0.8);
        }

        .accompanying-section h3 {
            color: #c53030;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
        }

        .accompanying-section h3::before {
            content: '👥';
            margin-right: 10px;
        }

        .accompanying-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }

        .accompanying-table th {
            background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
            color: white;
            padding: 15px 12px;
            text-align: left;
            font-weight: 600;
            font-size: 14px;
        }

        .accompanying-table td {
            padding: 12px;
            background: white;
            border-bottom: 1px solid #e2e8f0;
        }

        .accompanying-table tr:last-child td {
            border-bottom: none;
        }

        .accompanying-table tr:nth-child(even) td {
            background: #f8fafc;
        }

        .total-amount {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            border-radius: 16px;
            text-align: center;
            font-size: 22px;
            font-weight: 700;
            margin: 30px 0;
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
            position: relative;
            overflow: hidden;
        }

        .total-amount::before {
            content: '💰';
            position: absolute;
            left: 25px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 24px;
            opacity: 0.8;
        }

        .attachment-notice {
            background: linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%);
            border-left: 5px solid #38b2ac;
            padding: 20px;
            margin: 25px 0;
            border-radius: 12px;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }

        .attachment-notice strong {
            color: #2c7a7b;
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            font-size: 16px;
        }

        .closing-text {
            color: #718096;
            font-size: 16px;
            line-height: 1.7;
            margin-top: 25px;
            padding: 20px;
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            border-radius: 12px;
            border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .footer {
            background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
            color: white;
            text-align: center;
            padding: 35px 30px;
            font-size: 14px;
            line-height: 1.8;
        }

        .footer strong {
            font-size: 18px;
            color: #e2e8f0;
            display: block;
            margin-bottom: 10px;
        }

        .footer p {
            opacity: 0.9;
        }

        /* Animations et effets */
        .container {
            animation: slideUp 0.6s ease-out;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Responsive Design */
        @media only screen and (max-width: 600px) {
            body {
                padding: 10px;
            }
            
            .container {
                border-radius: 15px;
            }

            .header {
                padding: 30px 20px;
            }

            .header h1 {
                font-size: 24px;
            }

            .content {
                padding: 30px 20px;
            }

            .info-row {
                flex-direction: column;
                align-items: flex-start;
                gap: 8px;
            }

            .info-value {
                text-align: left;
                max-width: 100%;
                font-weight: 600;
                color: #667eea;
            }

            .total-amount {
                font-size: 20px;
                padding: 20px;
            }

            .total-amount::before {
                display: none;
            }

            .accompanying-table {
                font-size: 13px;
            }

            .accompanying-table th,
            .accompanying-table td {
                padding: 8px 6px;
            }

            .footer {
                padding: 25px 20px;
            }
        }

        /* Print Styles */
        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .container {
                box-shadow: none;
                border-radius: 0;
            }
            
            .header::before,
            .info-section::before {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{ $language === 'fr' ? 'Reçu d\'inscription' : 'Registration Receipt' }}</h1>
            <p>SITE 2025 - {{ $language === 'fr' ? 'Conférence Internationale' : 'International Conference' }}</p>
            <div class="date">{{ $language === 'fr' ? 'Émis le' : 'Issued on' }}: {{ date('d/m/Y') }}</div>
        </div>

        <div class="content">
            <div class="greeting">
                {{ $language === 'fr' ? 'Cher/Chère' : 'Dear' }} {{ $firstName }} {{ $lastName }},
            </div>
            
            <div class="intro-text">
                {{ $language === 'fr' 
                    ? 'Nous vous remercions pour votre inscription à la conférence SITE 2025. Veuillez trouver ci-joint votre reçu d\'inscription officiel.' 
                    : 'Thank you for your registration to the SITE 2025 conference. Please find attached your official registration receipt.' 
                }}
            </div>

            <div class="info-section">
                <h3>{{ $language === 'fr' ? 'Détails de l\'inscription' : 'Registration Details' }}</h3>
                
                <div class="info-row">
                    <span class="info-label">{{ $language === 'fr' ? 'Participant' : 'Participant' }}:</span>
                    <span class="info-value">{{ $firstName }} {{ $lastName }}</span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">{{ $language === 'fr' ? 'Email' : 'Email' }}:</span>
                    <span class="info-value">{{ $email }}</span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">{{ $language === 'fr' ? 'Nationalité' : 'Nationality' }}:</span>
                    <span class="info-value">
                        {{ $country 
                            
                        }}
                    </span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">{{ $language === 'fr' ? 'Type de participation' : 'Participation Type' }}:</span>
                    <span class="info-value">
                        {{ $participationType === 'with-article' 
                            ? ($language === 'fr' ? 'Avec article' : 'With article')
                            : ($language === 'fr' ? 'Sans article' : 'Without article')
                        }}
                    </span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">{{ $language === 'fr' ? 'Hébergement' : 'Accommodation' }}:</span>
                    <span class="info-value">
                        {{ $accommodationType === 'with-accommodation' 
                            ? ($language === 'fr' ? 'Avec hébergement (2 nuits)' : 'With accommodation (2 nights)')
                            : ($language === 'fr' ? 'Sans hébergement' : 'Without accommodation')
                        }}
                    </span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">{{ $language === 'fr' ? 'Mode de paiement' : 'Payment Method' }}:</span>
                    <span class="info-value">
                        @if($paymentMethod === 'bank-transfer')
                            {{ $language === 'fr' ? 'Virement bancaire' : 'Bank Transfer' }}
                        @elseif($paymentMethod === 'administrative-order')
                            {{ $language === 'fr' ? 'Mandat administratif' : 'Administrative Order' }}
                        @elseif($paymentMethod === 'check')
                            {{ $language === 'fr' ? 'Paiement par chèque' : 'Check Payment' }}
                        @else
                            {{ $paymentMethod }}
                        @endif
                    </span>
                </div>
            </div>

            {{-- Section des personnes accompagnantes --}}
            @if(isset($accompanyingPersons) && count($accompanyingPersons) > 0)
                <div class="accompanying-section">
                    <h3>{{ $language === 'fr' ? 'Personnes accompagnantes' : 'Accompanying Persons' }}</h3>
                    <table class="accompanying-table">
                        <thead>
                            <tr>
                                <th>{{ $language === 'fr' ? 'Nom' : 'Name' }}</th>
                                <th>{{ $language === 'fr' ? 'Âge' : 'Age' }}</th>
                                @if(collect($accompanyingPersons)->contains('discount'))
                                    <th style="text-align: right;">{{ $language === 'fr' ? 'Réduction' : 'Discount' }}</th>
                                @endif
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($accompanyingPersons as $person)
                                <tr>
                                    <td>{{ $person['name'] }}</td>
                                    <td>{{ $person['age'] }} {{ $language === 'fr' ? 'ans' : 'years' }}</td>
                                    @if(collect($accompanyingPersons)->contains('discount'))
                                        <td style="text-align: right;">
                                            @if(isset($person['discount']) && $person['discount'] > 0)
                                                {{ number_format($person['discount'], 2) }} TND
                                            @else
                                                -
                                            @endif
                                        </td>
                                    @endif
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @endif

            {{-- Montant total --}}
            <div class="total-amount">
                {{ $language === 'fr' ? 'Montant total' : 'Total Amount' }}: 
                {{ number_format($totalAmount, 2) }} TND
            </div>

            {{-- Notice de pièce jointe --}}
            <div class="attachment-notice">
                <strong>📎 {{ $language === 'fr' ? 'Pièce jointe' : 'Attachment' }}</strong>
                {{ $language === 'fr' 
                    ? 'Votre reçu d\'inscription détaillé est joint à cet email au format PDF.' 
                    : 'Your detailed registration receipt is attached to this email in PDF format.' 
                }}
            </div>
        </div>

        <div class="footer">
            <strong>SITE 2025</strong>
            <p>
                {{ $language === 'fr' ? 'Conférence Internationale' : 'International Conference' }}<br>
                Email: contact@site2025.org<br><br>
                {{ $language === 'fr' 
                    ? 'Ce reçu est généré automatiquement. Veuillez conserver une copie pour vos archives.' 
                    : 'This receipt is generated automatically. Please keep a copy for your records.' 
                }}
            </p>
        </div>
    </div>
</body>
</html>