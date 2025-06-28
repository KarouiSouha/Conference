<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réponse SITE2025</title>
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
            max-width: 650px;
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
            font-size: 2.2em;
            font-weight: 700;
            color: white;
            margin-bottom: 8px;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            
        }

        .header-title {
            font-size: 1.4em;
            font-weight: 600;
            color: white;
            margin-bottom: 5px;
            position: relative;
            z-index: 1;
        }

        .header-subtitle {
            color: rgba(255, 255, 255, 0.9);
            font-size: 1em;
            font-weight: 300;
            position: relative;
            z-index: 1;
        }

        .content {
            padding: 40px 30px;
        }

        .response-panel {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.12), rgba(118, 75, 162, 0.12));
            border-radius: 16px;
            padding: 30px;
            border-left: 5px solid #667eea;
            margin-bottom: 30px;
            position: relative;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);
        }

        .response-panel::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, transparent 49%, rgba(255,255,255,0.03) 50%, transparent 51%);
            pointer-events: none;
        }

        .response-text {
            color: #2d3748;
            font-size: 1.1em;
            line-height: 1.7;
            position: relative;
            z-index: 1;
        }

        .section-title {
            font-size: 1.3em;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .section-title::before {
            content: '';
            width: 4px;
            height: 20px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 2px;
        }

        .original-message-details {
            background: linear-gradient(135deg, #f8fafc, #f1f5f9);
            border-radius: 16px;
            padding: 25px;
            margin-bottom: 20px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .detail-row {
            display: flex;
            margin-bottom: 10px;
            flex-wrap: wrap;
        }

        .detail-row:last-child {
            margin-bottom: 0;
        }

        .detail-label {
            font-weight: 600;
            color: #4a5568;
            min-width: 80px;
            margin-right: 10px;
        }

        .detail-value {
            color: #2d3748;
            flex: 1;
        }

        .original-message-panel {
            background: linear-gradient(135deg, rgba(248, 250, 252, 0.9), rgba(241, 245, 249, 0.9));
            border-radius: 16px;
            padding: 25px;
            border: 1px solid #e2e8f0;
            margin-bottom: 30px;
            position: relative;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .original-message-text {
            color: #4a5568;
            font-style: italic;
            line-height: 1.6;
        }

        .signature-section {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08));
            border-radius: 20px;
            padding: 30px;
            text-align: center;
            border: 1px solid rgba(102, 126, 234, 0.15);
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.1);
            position: relative;
            overflow: hidden;
        }

        .signature-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, transparent 49%, rgba(255,255,255,0.05) 50%, transparent 51%);
            pointer-events: none;
        }

        .signature-text {
            font-weight: 600;
            color: #2d3748;
            font-size: 1.1em;
            margin-bottom: 8px;
        }

        .team-name {
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 700;
            font-size: 1.2em;
        }

        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
            margin: 30px 0;
        }

        .emoji {
            font-size: 1.2em;
            margin-right: 8px;
        }

        @media (max-width: 640px) {
            body {
                padding: 10px;
            }

            .header, .content {
                padding: 25px 20px;
            }

            .logo {
                font-size: 1.8em;
            }

            .header-title {
                font-size: 1.2em;
            }

            .detail-row {
                flex-direction: column;
            }

            .detail-label {
                min-width: auto;
                margin-bottom: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- En-tête avec branding SITE2025 -->
        <div class="header">
            <h1 class="header-title" style="text-align:center;font-size: 2.2em;font-weight: 700;">SITE2025</h1>
            <div class="header-title">📨 Réponse à votre message</div>
            <div class="header-subtitle">Merci pour votre prise de contact</div>
        </div>

        <div class="content">
            <!-- Message de réponse -->
            <div class="response-panel">
                <div class="response-text">
                    {{ $message ?? "Bonjour,\n\nMerci pour votre retour concernant SITE2025. Nous sommes ravis de recevoir vos commentaires et suggestions.\n\nNotre équipe technique a pris note de vos observations et nous travaillons continuellement à améliorer l'expérience utilisateur de notre plateforme.\n\nVos retours sont précieux pour nous aider à développer des solutions toujours plus adaptées à vos besoins. N'hésitez pas à nous faire part de toute autre suggestion.\n\nNous vous remercions pour votre confiance et votre engagement envers SITE2025." }}
                </div>
            </div>

            <div class="divider"></div>

            <!-- Détails du message original -->
            <h2 class="section-title">
                <span class="emoji">📌</span>
                Message original
            </h2>

            <div class="original-message-details">
                <div class="detail-row">
                    <div class="detail-label">De :</div>
                    <div class="detail-value">Amine (amineadded3@gmail.com)</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Sujet :</div>
                    <div class="detail-value">Feedback</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Date :</div>
                    <div class="detail-value">28 juin 2025 à 22h46</div>
                </div>
            </div>

            <!-- Message original -->
            <div class="original-message-panel">
                <div class="original-message-text">
                    "{{ $originalMessage['message'] ?? 'Le site présente quelques problèmes d\'affichage sur mobile et la navigation pourrait être améliorée. J\'aimerais également suggérer l\'ajout de nouvelles fonctionnalités pour une meilleure expérience utilisateur. Dans l\'ensemble, le concept est intéressant mais il y a de la place pour des améliorations.' }}"
                </div>
            </div>

            <div class="divider"></div>

            <!-- Signature professionnelle -->
            <div class="signature-section">
                <div class="signature-text">Cordialement,</div>
                <div class="team-name">L'équipe SITE2025</div>
                <div style="margin-top: 15px; color: #718096; font-size: 0.9em;">
                    Votre partenaire technologique de confiance ✨
                </div>
            </div>
        </div>
    </div>
</body>
</html>