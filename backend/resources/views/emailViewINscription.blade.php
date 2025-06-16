@php use Illuminate\Support\HtmlString; @endphp

@component('mail::layout')
{{-- Header --}}
@slot('header')
@component('mail::header', ['url' => config('app.url')])
    SITE2025
@endcomponent
@endslot

{{-- Body HTML personnalisé --}}
<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 15px; margin-bottom: 30px;">
    <h1 style="font-size: 32px; font-weight: bold; color: #ffffff; text-align: center; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
        @if ($language === 'fr')
            🎉 Bienvenue au SITE2025, {{ $nom }} !
        @else
            🎉 Welcome to SITE2025, {{ $nom }}!
        @endif
    </h1>
    <p style="font-size: 18px; color: #f8f9fa; text-align: center; margin: 15px 0 0 0; opacity: 0.9;">
        @if ($language === 'fr')
            Votre aventure technologique commence maintenant
        @else
            Your tech journey begins now
        @endif
    </p>
</div>


<div style="text-align: center; margin: 30px 0;">
    <a href="{{ $url ?? '#' }}" style="background-color: #4f46e5; color: #fff; font-size: 16px; font-weight: bold; padding: 14px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">
        @if ($language === 'fr')
            🎫 Accéder à mon espace participant
        @else
            🎫 Access my participant space
        @endif
    </a>
</div>

<div style="background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #667eea; margin-top: 25px;">
    <p style="font-size: 14px; color: #6c757d; margin: 0 0 10px 0; line-height: 1.5;">
        <strong style="color: #495057;">
            📅 @if ($language === 'fr') Informations importantes : @else Important Information: @endif
        </strong><br>
        @if ($language === 'fr')
            Gardez cet email précieusement, il contient vos informations d'accès à l'événement.
        @else
            Please keep this email safe; it contains your access information for the event.
        @endif
    </p>
    <p style="font-size: 14px; color: #6c757d; margin: 0; line-height: 1.5;">
        <strong style="color: #495057;">
            💌 @if ($language === 'fr') Besoin d'aide ? @else Need help? @endif
        </strong><br>
        @if ($language === 'fr')
            Notre équipe est là pour vous accompagner. N'hésitez pas à nous contacter !
        @else
            Our team is here to support you. Don’t hesitate to contact us!
        @endif
    </p>
</div>

<div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
    <p style="font-size: 16px; color: #495057; margin: 0 0 10px 0;">
        @if ($language === 'fr')
            À très bientôt au <strong style="color: #667eea;">SITE2025</strong> ! ✨
        @else
            See you soon at <strong style="color: #667eea;">SITE2025</strong>! ✨
        @endif
    </p>
    <p style="font-size: 14px; color: #6c757d; margin: 0;">
        <strong>
            @if ($language === 'fr')
                L'équipe SITE2025
            @else
                The SITE2025 Team
            @endif
        </strong>
    </p>
</div>

{{-- Footer --}}
@slot('footer')
@component('mail::footer')
    &copy; {{ date('Y') }} SITE2025. 
    @if ($language === 'fr')
        Tous droits réservés.
    @else
        All rights reserved.
    @endif
@endcomponent
@endslot
@endcomponent
