<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue au SITE2025</title>
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

        .cta-section {
            text-align: center;
            margin: 40px 0;
        }

        .cta-button {
            display: inline-block;
            padding: 16px 32px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 1.1em;
            transition: all 0.3s ease;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
            position: relative;
            overflow: hidden;
        }

        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
        }

        .cta-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
        }

        .cta-button:hover::before {
            left: 100%;
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

            .cta-button {
                padding: 14px 28px;
                font-size: 1em;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">SITE2025</div>
            <div class="subtitle">
                {{ $language === 'fr' ? 'Votre aventure technologique commence ici' : 'Your technological journey starts here' }}
            </div>
        </div>

        <div class="content">
            <div class="welcome-message">
                <h1 class="welcome-title">
                    {{ $language === 'fr' ? "Bienvenue, $nom !" : "Welcome, $nom!" }}
                </h1>
                <p class="welcome-subtitle">
                    {{ $language === 'fr' ? "Nous sommes ravis de vous accueillir dans cette expérience unique" : "We are delighted to welcome you to this unique experience" }}
                </p>
            </div>

            <div class="cta-section">
                <a href="{{ $url }}" target="_blank" class="cta-button">
                    {{ $language === 'fr' ? '🎫 Télécharger votre badge' : '🎫 Download your badge' }}
                </a>
            </div>

            <div class="divider"></div>

            <div class="info-cards">
                <div class="info-card">
                    <div class="info-card-title">
                        <span class="icon">📅</span>
                        {{ $language === 'fr' ? 'Informations importantes' : 'Important Information' }}
                    </div>
                    <div class="info-card-content">
                        {{ $language === 'fr' 
                            ? "Conservez précieusement cet email ! Il contient tous vos accès pour l'événement et vous servira de référence tout au long de votre participation au SITE2025."
                            : "Please keep this email safe! It contains all your access credentials for the event and will serve as a reference throughout your participation in SITE2025." }}
                    </div>
                </div>

                <div class="info-card">
                    <div class="info-card-title">
                        <span class="icon">💬</span>
                        {{ $language === 'fr' ? 'Support et assistance' : 'Support and Assistance' }}
                    </div>
                    <div class="info-card-content">
                        {{ $language === 'fr' 
                            ? "Notre équipe dédiée est à votre disposition pour vous accompagner. N'hésitez pas à nous contacter pour toute question ou assistance nécessaire."
                            : "Our dedicated team is available to support you. Feel free to contact us with any questions or if you need help." }}
                    </div>
                </div>
            </div>
        </div>

        <div class="footer">
            <div class="footer-message">
                {{ $language === 'fr' ? 'À très bientôt au' : 'See you soon at' }} <strong>SITE2025</strong> ! ✨
            </div>
            <div class="footer-signature">
                {{ $language === 'fr' ? 'Cordialement,' : 'Best regards,' }}<br>
                <strong>{{ $language === 'fr' ? "L'équipe SITE2025" : "The SITE2025 Team" }}</strong>
            </div>
        </div>
    </div>
</body>
</html>
