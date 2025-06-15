<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;

class Registration extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'establishment',
        'title',
        'email',
        'password',
        'phone',
        'participation_type',
        'has_accompanying',
        'accompanying_details',
        'accommodation_type',
        'payment_method',
        'payment_proof',
        'status',
        'amount',
        'is_paid',
        'paid_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'paid_at' => 'datetime',
        'is_paid' => 'boolean',
        'amount' => 'decimal:2',
    ];

    /**
     * Automatically hash the password when setting it.
     */
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = Hash::make($value);
    }

    /**
     * Get the full name attribute.
     */
    public function getFullNameAttribute(): string
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    /**
     * Calculate the registration amount based on accommodation type.
     */
    public function calculateAmount(): float
    {
        return match($this->accommodation_type) {
            'with-accommodation' => 120.00,
            'without-accommodation' => 50.00,
            default => 0.00
        };
    }

    /**
     * Scope for confirmed registrations.
     */
    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    /**
     * Scope for pending registrations.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope for paid registrations.
     */
    public function scopePaid($query)
    {
        return $query->where('is_paid', true);
    }

    /**
     * Mark registration as paid.
     */
    public function markAsPaid(): void
    {
        $this->update([
            'is_paid' => true,
            'paid_at' => now(),
            'status' => 'confirmed'
        ]);
    }

    /**
     * Get the payment proof URL.
     */
    public function getPaymentProofUrlAttribute(): ?string
    {
        return $this->payment_proof ? url('storage/' . $this->payment_proof) : null;
    }
}
