<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Programme de la Conférence</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        h1 {
            text-align: center;
            color: #1e293b;
        }
        h2 {
            color: #475569;
        }
        .day {
            margin-bottom: 20px;
        }
        .session {
            margin-bottom: 10px;
            padding: 10px;
            border-bottom: 1px solid #e2e8f0;
        }
        .session-time {
            font-weight: bold;
            color: #1e293b;
        }
        .session-title {
            margin: 5px 0;
            color: #334155;
        }
        .session-details {
            color: #64748b;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <h1>{{ $lang === 'en' ? 'Conference Program' : 'Programme de la Conférence' }}</h1>

    @foreach ($programmes as $date => $sessions)
        <div class="day">
            <h2>{{ \Carbon\Carbon::parse($date)->translatedFormat('l d F Y', null, $lang) }}</h2>
            @foreach ($sessions as $session)
                <div class="session">
                    <div class="session-time">{{ \Carbon\Carbon::parse($session['heure'])->format('H:i') }}</div>
                    <div class="session-title">{{ $session['evenement'] }}</div>
                    @if ($session['description'])
                        <div class="session-details">{{ $session['description'] }}</div>
                    @endif
                    @if ($session['intervenant'])
                        <div class="session-details">
                            {{ $lang === 'en' ? 'Speaker' : 'Intervenant' }}: {{ $session['intervenant'] }}
                        </div>
                    @endif
                    @if ($session['lieu'])
                        <div class="session-details">
                            {{ $lang === 'en' ? 'Location' : 'Lieu' }}: {{ $session['lieu'] }}
                        </div>
                    @endif
                    @if ($session['speaker'])
                        <div class="session-details">
                            {{ $lang === 'en' ? 'Speaker Details' : 'Détails de l\'intervenant' }}:
                            {{ $session['speaker']['name'] }} ({{ $session['speaker']['job'] }})
                        </div>
                    @endif
                </div>
            @endforeach
        </div>
    @endforeach
</body>
</html>