<!DOCTYPE html>
<html lang="{{ $language === 'fr' ? 'fr' : 'en' }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $language === 'fr' ? 'Confirmation de Paiement' : 'Payment Confirmation' }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
            background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 30px 30px;
            animation: float 20s linear infinite;
        }

        @keyframes float {
            0% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-10px) translateX(5px); }
            100% { transform: translateY(0px) translateX(0px); }
        }

        .logo {
            font-size: 2.5em;
            font-weight: 700;
            color: white;
            margin-bottom: 10px;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            position: relative;
            z-index: 1;
        }

        .subtitle {
            color: rgba(255, 255, 255, 0.9);
            font-size: 1.1em;
            font-weight: 300;
            position: relative;
            z-index: 1;
        }

        .content {
            padding: 40px 30px;
        }

        .welcome-message {
            text-align: center;
            margin-bottom: 40px;
        }

        .welcome-title {
            font-size: 2em;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 10px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .welcome-subtitle {
            color: #718096;
            font-size: 1.1em;
            font-weight: 400;
        }

        .payment-summary {
            background: rgba(40, 167, 69, 0.1);
            border-radius: 16px;
            padding: 30px;
            margin: 30px 0;
            border-left: 4px solid #28a745;
            text-align: center;
        }

        .payment-icon {
            font-size: 3em;
            margin-bottom: 15px;
            color: #28a745;
        }

        .payment-title {
            font-size: 1.4em;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 15px;
        }

        .payment-amount {
            font-size: 2em;
            font-weight: 700;
            color: #28a745;
            margin-bottom: 10px;
        }

        .payment-date {
            color: #718096;
            font-size: 0.95em;
        }

        .info-cards {
            display: grid;
            gap: 20px;
            margin: 40px 0;
        }

        .info-card {
            background: rgba(102, 126, 234, 0.05);
            border-radius: 16px;
            padding: 25px;
            border-left: 4px solid #667eea;
            transition: all 0.3s ease;
        }

        .info-card:hover {
            transform: translateX(5px);
            background: rgba(102, 126, 234, 0.08);
        }

        .info-card-title {
            font-size: 1.2em;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .info-card-content {
            color: #4a5568;
            line-height: 1.6;
        }

        .icon {
            font-size: 1.2em;
            display: inline-block;
            width: 30px;
            height: 30px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 50%;
            text-align: center;
            line-height: 30px;
            color: white;
        }

        .footer {
            background: #f8fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }

        .footer-message {
            color: #2d3748;
            font-size: 1.1em;
            margin-bottom: 15px;
            font-weight: 500;
        }

        .footer-signature {
            color: #718096;
            font-style: italic;
        }

        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
            margin: 30px 0;
        }

        .reference-info {
            background: #f8fafc;
            border-radius: 12px;
            padding: 20px;
            margin: 30px 0;
            text-align: center;
            border: 1px solid #e2e8f0;
        }

        .reference-title {
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 5px;
        }

        .reference-id {
            font-family: 'Courier New', monospace;
            color: #667eea;
            font-weight: 600;
        }

        @media (max-width: 640px) {
            body {
                padding: 10px;
            }

            .header, .content, .footer {
                padding: 20px;
            }

            .welcome-title {
                font-size: 1.6em;
            }

            .payment-amount {
                font-size: 1.6em;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">SITE2025</div>
            <div class="subtitle">
                {{ $language === 'fr' ? 'Confirmation de paiement' : 'Payment Confirmation' }}
            </div>
        </div>

        <div class="content">
            <div class="welcome-message">
                <h1 class="welcome-title">
                    {{ $language === 'fr' 
                        ? "Merci, $first_name $last_name !" 
                        : "Thank you, $first_name $last_name!" }}
                </h1>
                <p class="welcome-subtitle">
                    {{ $language === 'fr' 
                        ? "Votre paiement a été traité avec succès" 
                        : "Your payment has been processed successfully" }}
                </p>
            </div>

            <div class="payment-summary">
                <div class="payment-icon">✅</div>
                <div class="payment-title">
                    {{ $language === 'fr' ? 'Paiement confirmé' : 'Payment Confirmed' }}
                </div>
                <div class="payment-amount">{{ $amount }} TND</div>
                <div class="payment-date">
                    {{ $language === 'fr' ? 'Reçu le' : 'Received on' }} 
                    {{ \Carbon\Carbon::parse($paid_at)->format($language === 'fr' ? 'd/m/Y à H:i' : 'M d, Y at H:i') }}
                </div>
            </div>

            <div class="reference-info">
                <div class="reference-title">
                    {{ $language === 'fr' ? 'Référence de votre inscription' : 'Your registration reference' }}
                </div>
                <div class="reference-id">#SITE2025-{{ str_pad($registration_id, 4, '0', STR_PAD_LEFT) }}</div>
            </div>

            <div class="divider"></div>

            <div class="footer">
            <div class="footer-message">
                {{ $language === 'fr' ? 'Nous avons hâte de vous accueillir au' : 'We look forward to welcoming you to' }} <strong>SITE2025</strong> ! ✨
            </div>
            <div class="footer-signature">
                {{ $language === 'fr' ? 'Cordialement,' : 'Best regards,' }}<br>
                <strong>{{ $language === 'fr' ? "L'équipe SITE2025" : "The SITE2025 Team" }}</strong>
            </div>
        </div>
    </div>
</body>
</html>