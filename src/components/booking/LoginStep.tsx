'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ChevronDown, Search, KeyRound, Copy, Check, RotateCw, Clock } from 'lucide-react';
import { prettyPhone, makeGuardCode, pad } from '@/lib/engine';

const OTP_EXPIRY_SECONDS = 120; // 2 menit
const RESEND_COOLDOWN_SECONDS = 30; // 30 detik cooldown kirim ulang

interface CountryOption {
  code: string;
  name: string;
  dial: string;
  placeholder: string;
  flag: React.ReactNode;
}

function FlagIcon({ code }: { code: string }) {
  if (code === 'ID') {
    return (
      <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-full flex-shrink-0 border border-black/10">
        <rect width="24" height="12" fill="#DC2626" />
        <rect y="12" width="24" height="12" fill="#FFFFFF" />
      </svg>
    );
  }
  if (code === 'SG') {
    return (
      <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-full flex-shrink-0 border border-black/10">
        <rect width="24" height="12" fill="#EF4444" />
        <rect y="12" width="24" height="12" fill="#FFFFFF" />
        <circle cx="8" cy="6" r="3" fill="#FFFFFF" />
        <circle cx="9.2" cy="6" r="2.6" fill="#EF4444" />
      </svg>
    );
  }
  if (code === 'MY') {
    return (
      <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-full flex-shrink-0 border border-black/10">
        <rect width="24" height="24" fill="#FFFFFF" />
        <rect y="0" width="24" height="3" fill="#DC2626" />
        <rect y="6" width="24" height="3" fill="#DC2626" />
        <rect y="12" width="24" height="3" fill="#DC2626" />
        <rect y="18" width="24" height="3" fill="#DC2626" />
        <rect width="12" height="12" fill="#1D4ED8" />
        <circle cx="6" cy="6" r="2.5" fill="#FACC15" />
      </svg>
    );
  }
  if (code === 'JP') {
    return (
      <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-full flex-shrink-0 border border-black/10">
        <rect width="24" height="24" fill="#FFFFFF" />
        <circle cx="12" cy="12" r="5" fill="#DC2626" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-full flex-shrink-0 border border-black/10">
      <rect width="24" height="24" fill="#1D4ED8" />
      <rect y="8" width="24" height="8" fill="#FFFFFF" />
      <rect y="10" width="24" height="4" fill="#DC2626" />
    </svg>
  );
}

const COUNTRIES: CountryOption[] = [
  { code: 'ID', name: 'Indonesia', dial: '+62', placeholder: '812 3456 7890', flag: <FlagIcon code="ID" /> },
  { code: 'SG', name: 'Singapore', dial: '+65', placeholder: '9123 4567', flag: <FlagIcon code="SG" /> },
  { code: 'MY', name: 'Malaysia', dial: '+60', placeholder: '12 345 6789', flag: <FlagIcon code="MY" /> },
  { code: 'JP', name: 'Japan', dial: '+81', placeholder: '90 1234 5678', flag: <FlagIcon code="JP" /> },
  { code: 'AU', name: 'Australia', dial: '+61', placeholder: '412 345 678', flag: <FlagIcon code="AU" /> },
];

interface LoginStepProps {
  phoneInput: string;
  setPhoneInput: (val: string) => void;
  otpInput: string;
  setOtpInput: (val: string) => void;
  generatedOtp: string;
  setGeneratedOtp: (val: string) => void;
  phoneError: string;
  otpError: string;
  onRequestOtp: (e: React.FormEvent) => void;
  onVerifyOtp: (e: React.FormEvent) => void;
  onBack?: () => void;
}

export default function LoginStep({
  phoneInput,
  setPhoneInput,
  otpInput,
  setOtpInput,
  generatedOtp,
  setGeneratedOtp,
  phoneError,
  otpError,
  onRequestOtp,
  onVerifyOtp,
  onBack,
}: LoginStepProps) {
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(COUNTRIES[0]);
  const [localPhone, setLocalPhone] = useState(() => {
    const raw = phoneInput.trim();
    if (raw.startsWith('+62')) return raw.slice(3).replace(/^0+/, '');
    if (raw.startsWith('0')) return raw.slice(1);
    return raw;
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const syncPhoneValue = (country: CountryOption, rawLocal: string) => {
    const cleaned = rawLocal.replace(/[^\d\s-]/g, '');
    const digitsOnly = cleaned.replace(/\D/g, '');
    if (country.code === 'ID') {
      // Allow users to type either 812... or 0812... or paste 62812...
      const stripped = digitsOnly.startsWith('62')
        ? digitsOnly.slice(2).replace(/^0+/, '')
        : digitsOnly.replace(/^0+/, '');
      setLocalPhone(stripped);
      setPhoneInput(stripped ? `0${stripped}` : '');
    } else {
      const stripped = digitsOnly.replace(/^0+/, '');
      setLocalPhone(stripped);
      setPhoneInput(stripped ? `${country.dial}${stripped}` : '');
    }
  };
  const [countrySearch, setCountrySearch] = useState('');
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [otpSecondsLeft, setOtpSecondsLeft] = useState(OTP_EXPIRY_SECONDS);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleOutside);
    }
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [dropdownOpen]);

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.dial.includes(countrySearch)
  );

  const isWaitingForPhone = !generatedOtp || generatedOtp === '123456';

  // Auto-focus first OTP box and reset timers when entering/refreshing OTP screen
  useEffect(() => {
    if (!isWaitingForPhone) {
      setOtpSecondsLeft(OTP_EXPIRY_SECONDS);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      const t = setTimeout(() => otpRefs.current[0]?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isWaitingForPhone, generatedOtp]);

  // Live 1-second OTP expiry & resend cooldown countdown
  useEffect(() => {
    if (isWaitingForPhone) return;
    if (otpSecondsLeft <= 0 && resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setOtpSecondsLeft((s) => (s > 0 ? s - 1 : 0));
      setResendCooldown((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isWaitingForPhone, otpSecondsLeft, resendCooldown]);

  const isOtpExpired = otpSecondsLeft <= 0;
  const isOtpUrgent = otpSecondsLeft > 0 && otpSecondsLeft <= 20;
  const formattedOtpTimer = `${pad(Math.floor(otpSecondsLeft / 60))}:${pad(otpSecondsLeft % 60)}`;

  const otpDigits = Array.from({ length: 6 }, (_, i) => otpInput[i] || '');

  const handleOtpDigitChange = (index: number, raw: string) => {
    const cleaned = raw.replace(/\D/g, '');
    if (!cleaned) {
      const next = [...otpDigits];
      next[index] = '';
      setOtpInput(next.join(''));
      return;
    }

    // Handle multi-digit paste/autofill into a single box
    if (cleaned.length > 1) {
      const next = [...otpDigits];
      for (let i = 0; i < cleaned.length && index + i < 6; i++) {
        next[index + i] = cleaned[i];
      }
      setOtpInput(next.join('').slice(0, 6));
      const focusIdx = Math.min(index + cleaned.length, 5);
      otpRefs.current[focusIdx]?.focus();
      return;
    }

    const next = [...otpDigits];
    next[index] = cleaned;
    setOtpInput(next.join(''));
    if (index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const next = [...otpDigits];
      next[index - 1] = '';
      setOtpInput(next.join(''));
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    setOtpInput(pasted);
    const focusIdx = Math.min(pasted.length, 5);
    otpRefs.current[focusIdx]?.focus();
  };

  const handleCopyOtp = async () => {
    try {
      await navigator.clipboard.writeText(generatedOtp);
      setCopiedOtp(true);
      setTimeout(() => setCopiedOtp(false), 1800);
    } catch {
      // Clipboard API unavailable
    }
  };

  const handleResendOtp = () => {
    const fresh = makeGuardCode();
    setGeneratedOtp(fresh);
    setOtpInput('');
    setCopiedOtp(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-ink-line shadow-card">
      <div className="p-6 sm:p-9 space-y-6">
        {/* Clean App Header */}
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-bloodwine tracking-tight">
            {isWaitingForPhone ? 'Masuk ke LocknGo' : 'Verifikasi OTP'}
          </h1>
          <p className="text-sm text-ink-muted leading-relaxed">
            {isWaitingForPhone
              ? 'Masukkan nomor HP aktif untuk melanjutkan.'
              : `Masukkan 6 digit kode yang dikirim ke ${prettyPhone(phoneInput)}.`}
          </p>
        </div>

        {/* Form Area */}
        {isWaitingForPhone ? (
          <form onSubmit={onRequestOtp} className="space-y-5">
            <div className="space-y-2 relative" ref={dropdownRef}>
              <label
                htmlFor="phone-input"
                className="block text-xs font-bold uppercase tracking-wider text-ink-muted"
              >
                Nomor HP
              </label>

              <div className="flex items-center rounded-2xl border border-ink-line bg-white focus-within:border-bloodwine focus-within:ring-4 focus-within:ring-bloodwine/10 transition-all">
                {/* Country Code Picker Button */}
                <button
                  type="button"
                  onClick={() => setDropdownOpen((o) => !o)}
                  aria-label="Pilih kode negara"
                  aria-expanded={dropdownOpen}
                  className="inline-flex items-center gap-2 px-3.5 py-3.5 bg-cream/60 hover:bg-cream border-r border-ink-line rounded-l-2xl transition-colors flex-shrink-0"
                >
                  {selectedCountry.flag}
                  <span className="font-mono text-sm font-bold text-ink">
                    {selectedCountry.dial}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-ink-muted transition-transform duration-150 ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Phone Number Input */}
                <input
                  id="phone-input"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder={selectedCountry.placeholder}
                  value={localPhone}
                  onChange={(e) => syncPhoneValue(selectedCountry, e.target.value)}
                  className="w-full px-4 py-3.5 bg-transparent font-mono text-base font-bold text-ink placeholder:text-ink-soft/70 placeholder:font-normal focus:outline-none rounded-r-2xl"
                  required
                />
              </div>

              {/* Searchable Country Dropdown */}
              {dropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-full sm:w-72 bg-white rounded-2xl border border-ink-line shadow-xl z-40 overflow-hidden">
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-ink-line bg-cream/40">
                    <Search className="w-4 h-4 text-ink-soft flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Cari negara..."
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      className="w-full text-xs text-ink placeholder:text-ink-soft bg-transparent focus:outline-none"
                    />
                  </div>
                  <ul className="max-h-52 overflow-y-auto py-1">
                    {filteredCountries.map((country) => (
                      <li key={country.code}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCountry(country);
                            syncPhoneValue(country, localPhone);
                            setDropdownOpen(false);
                            setCountrySearch('');
                          }}
                          className={`w-full px-3.5 py-2.5 flex items-center justify-between text-xs hover:bg-cream transition-colors ${
                            selectedCountry.code === country.code
                              ? 'bg-bloodwine-tint/40 font-bold text-bloodwine'
                              : 'text-ink'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            {country.flag}
                            <span>{country.name}</span>
                          </span>
                          <span className="font-mono text-ink-muted">{country.dial}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {phoneError && (
                <p className="text-xs font-semibold text-red-600">{phoneError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-sunflare hover:bg-sunflare-hover active:scale-[0.98] text-bloodwine font-extrabold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Lanjutkan</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 text-xs text-ink-muted hover:text-bloodwine font-semibold transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ubah lokasi atau durasi</span>
              </button>
            )}
          </form>
        ) : (
          <form onSubmit={onVerifyOtp} className="space-y-5">
            {/* Prototype OTP Notification Bar */}
            <div className="bg-sunflare-light/70 px-3.5 py-2.5 rounded-2xl border border-sunflare/50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-bloodwine">
                <KeyRound className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="font-medium">Simulasi SMS / WA:</span>
                <span className="font-mono font-extrabold tracking-widest text-bloodwine bg-white px-2.5 py-0.5 rounded-lg border border-sunflare/40">
                  {generatedOtp}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyOtp}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-cream border border-sunflare/40 text-[11px] font-bold text-bloodwine transition-colors flex-shrink-0"
              >
                {copiedOtp ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>

            {/* 6 Individual OTP Digit Inputs */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Kode OTP
                </label>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold ${
                    isOtpExpired
                      ? 'text-red-600'
                      : isOtpUrgent
                      ? 'text-amber-700'
                      : 'text-ink-muted'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  {isOtpExpired ? 'Kedaluwarsa' : `Berlaku ${formattedOtpTimer}`}
                </span>
              </div>

              <div className="grid grid-cols-6 gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      otpRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete={i === 0 ? 'one-time-code' : 'off'}
                    maxLength={6}
                    disabled={isOtpExpired}
                    value={digit}
                    aria-label={`Digit OTP ${i + 1}`}
                    onChange={(e) => handleOtpDigitChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className={`w-full h-13 sm:h-14 rounded-2xl border text-center font-mono text-xl sm:text-2xl font-extrabold text-bloodwine bg-white transition-all focus:outline-none focus:border-bloodwine focus:ring-4 focus:ring-bloodwine/10 disabled:opacity-45 disabled:bg-cream/60 disabled:cursor-not-allowed ${
                      digit
                        ? 'border-bloodwine/60 bg-bloodwine-tint/20'
                        : 'border-ink-line'
                    }`}
                  />
                ))}
              </div>
              {isOtpExpired ? (
                <p className="text-xs font-semibold text-red-600">
                  Kode OTP sudah kedaluwarsa. Klik kirim ulang untuk mendapatkan kode baru.
                </p>
              ) : otpError ? (
                <p className="text-xs font-semibold text-red-600">{otpError}</p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={otpInput.length < 6 || isOtpExpired}
              className="w-full py-3.5 rounded-2xl bg-bloodwine hover:bg-bloodwine-hover active:scale-[0.98] disabled:opacity-45 disabled:cursor-not-allowed text-white font-extrabold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Verifikasi &amp; Lanjut</span>
              <ArrowRight className="w-4 h-4 text-sunflare" />
            </button>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  setGeneratedOtp('');
                  setOtpInput('');
                }}
                className="text-xs font-semibold text-ink-muted hover:text-bloodwine transition-colors"
              >
                Ganti nomor HP
              </button>
              <button
                type="button"
                disabled={resendCooldown > 0 && !isOtpExpired}
                onClick={handleResendOtp}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-bloodwine hover:text-bloodwine-hover disabled:text-ink-soft disabled:cursor-not-allowed transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>
                  {resendCooldown > 0 && !isOtpExpired
                    ? `Kirim ulang (${resendCooldown}d)`
                    : 'Kirim ulang kode'}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
