'use client';

/**
 * Quiky — Quikkred's friendly mascot helper.
 * Floats as a circular button on every page (mirroring the support chat
 * icon). Clicking opens a panel that explains site features in the user's
 * language and speaks them via the Web Speech API.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, X, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import {
  QUIKY_SPEECH_LANG,
  QuikyTopicKey,
  getQuikyStrings,
} from './quiky-translations';
import { detectLanguageByRegion } from './region-language';

// Plain <img> is used (not next/image) because the project's next.config.ts
// does not enable `dangerouslyAllowSVG`, so the SVG optimizer would block them.
// The floating button uses the SVG (only Asset 4 has no PNG sibling); the
// in-panel hero + per-card decorations use PNG variants which look cleaner
// at larger sizes. Spaces in filenames are URL-encoded.
const BUTTON_POSE = '/muscot-img/Asset%204.svg';

// Each topic gets its own decorative mascot pose so the vertical card
// stack feels visually varied as users scroll through it.
const TOPIC_CARDS: { key: QuikyTopicKey; pose: string }[] = [
  { key: 'loans',       pose: '/muscot-img/Asset%208.png' },
  { key: 'apply',       pose: '/muscot-img/Asset%209.png' },
  { key: 'emi',         pose: '/muscot-img/Asset%2010.png' },
  { key: 'eligibility', pose: '/muscot-img/Asset%2011.png' },
  { key: 'documents',   pose: '/muscot-img/Asset%2012.png' },
  { key: 'track',       pose: '/muscot-img/Asset%2037.png' },
  { key: 'languages',   pose: '/muscot-img/Asset%2038.png' },
  { key: 'support',     pose: '/muscot-img/Asset%2039.png' },
];

const INTRO_POSE = '/muscot-img/Asset%2040.png';

const SESSION_INTRO_KEY = 'quiky:introduced';
const AUDIO_PREF_KEY = 'quiky:audio';

export default function QuikyMascot() {
  const { language, setLanguage } = useLanguage();
  const isRtl = language === 'ur';
  const strings = useMemo(() => getQuikyStrings(language), [language]);

  const [isOpen, setIsOpen] = useState(false);
  const [activeTopic, setActiveTopic] = useState<QuikyTopicKey>('intro');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [hasNudge, setHasNudge] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  const speechSupported = useRef(false);

  // ---- portal mount flag (matches the chat widget's pattern) ----
  useEffect(() => {
    setMounted(true);
  }, []);

  // ---- mobile detection ----
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ---- restore preferences ----
  useEffect(() => {
    if (typeof window === 'undefined') return;
    speechSupported.current = 'speechSynthesis' in window;
    const savedAudio = localStorage.getItem(AUDIO_PREF_KEY);
    if (savedAudio === '0') setAudioEnabled(false);
  }, []);

  // ---- prime browser voice list (loaded async in some browsers) ----
  useEffect(() => {
    if (!speechSupported.current) return;
    const synth = window.speechSynthesis;
    synth.getVoices();
    const handler = () => synth.getVoices();
    synth.addEventListener?.('voiceschanged', handler);
    return () => synth.removeEventListener?.('voiceschanged', handler);
  }, []);

  // ---- first-visit attention nudge + tooltip + auto-open ----
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const introduced = sessionStorage.getItem(SESSION_INTRO_KEY) === '1';

    const nudgeStart = setTimeout(() => setHasNudge(true), 1200);
    const tooltipStart = setTimeout(() => setShowTooltip(true), 1500);
    const tooltipEnd = setTimeout(
      () => setShowTooltip(false),
      introduced ? 4500 : 7500
    );
    const nudgeEnd = setTimeout(() => setHasNudge(false), 4200);

    // Auto-open the panel only on the first session visit. The 2.5s delay
    // gives the region-language detection a chance to finish first so the
    // intro greeting shows in the user's regional language.
    let autoOpenTimer: ReturnType<typeof setTimeout> | undefined;
    if (!introduced) {
      autoOpenTimer = setTimeout(() => {
        setIsOpen(true);
        setActiveTopic('intro');
      }, 2500);
    }

    sessionStorage.setItem(SESSION_INTRO_KEY, '1');

    return () => {
      clearTimeout(nudgeStart);
      clearTimeout(nudgeEnd);
      clearTimeout(tooltipStart);
      clearTimeout(tooltipEnd);
      if (autoOpenTimer) clearTimeout(autoOpenTimer);
    };
  }, []);

  // ---- region-based language auto-detection (skipped if user already chose) ----
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hasSelected = document.cookie
      .split('; ')
      .some((c) => c.startsWith('languageSelected=true'));
    if (hasSelected) return;

    let cancelled = false;
    detectLanguageByRegion()
      .then((detected) => {
        if (cancelled || !detected) return;
        if (detected === language) return;
        setLanguage(detected);
      })
      .catch(() => {
        /* ignore — fall back to current language */
      });

    return () => {
      cancelled = true;
    };
    // Run once on mount; we deliberately don't re-run on language change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- when language changes, briefly nudge to draw attention ----
  useEffect(() => {
    setHasNudge(true);
    const t = setTimeout(() => setHasNudge(false), 3000);
    return () => clearTimeout(t);
  }, [language]);

  // ---- speech ----
  const stopSpeech = useCallback(() => {
    if (!speechSupported.current) return;
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => stopSpeech, [stopSpeech]);

  const speak = useCallback(
    (text: string) => {
      if (!audioEnabled || !speechSupported.current || !text) return;
      const synth = window.speechSynthesis;
      synth.cancel();

      const utter = new SpeechSynthesisUtterance(text);
      const targetLang = QUIKY_SPEECH_LANG[language] || 'en-IN';
      utter.lang = targetLang;
      utter.rate = 1.25;
      utter.pitch = 1.05;
      utter.volume = 1;

      const voices = synth.getVoices();
      const voice =
        voices.find((v) => v.lang === targetLang) ||
        voices.find((v) => v.lang?.toLowerCase().startsWith(language)) ||
        voices.find((v) => v.lang === 'en-IN') ||
        voices.find((v) => v.lang?.startsWith('en')) ||
        null;
      if (voice) utter.voice = voice;

      synth.speak(utter);
    },
    [audioEnabled, language]
  );

  // Speak the active message whenever it (or audio toggle) changes.
  useEffect(() => {
    if (!isOpen) return;
    speak(strings.messages[activeTopic]);
  }, [isOpen, activeTopic, language, strings, speak]);

  // ---- handlers ----
  const handleToggle = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        setActiveTopic('intro');
        setHasNudge(false);
        setShowTooltip(false);
      } else {
        stopSpeech();
      }
      return next;
    });
  }, [stopSpeech]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    stopSpeech();
  }, [stopSpeech]);

  const handleTopic = useCallback((topic: QuikyTopicKey) => {
    setActiveTopic(topic);
  }, []);

  // Pose shown in the header avatar — driven by the active topic so each
  // selection visually swaps the character.
  const headerPose = useMemo(() => {
    if (activeTopic === 'intro') return INTRO_POSE;
    return TOPIC_CARDS.find((c) => c.key === activeTopic)?.pose ?? INTRO_POSE;
  }, [activeTopic]);

  const handleToggleAudio = useCallback(() => {
    setAudioEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(AUDIO_PREF_KEY, next ? '1' : '0');
      } catch {
        /* ignore */
      }
      if (!next) stopSpeech();
      return next;
    });
  }, [stopSpeech]);

  // ---- positioning (left side; LiveSupportChat sits on the right) ----
  const sideClass = isRtl
    ? isMobile
      ? 'right-3'
      : 'right-6'
    : isMobile
      ? 'left-3'
      : 'left-6';
  const bottomBtn = isMobile ? 'bottom-4' : 'bottom-6';
  const bottomPanel = isMobile ? 'bottom-20' : 'bottom-24';
  const buttonSize = isMobile ? 'w-14 h-14' : 'w-16 h-16';

  // Render via a portal to <body> so the fixed positioning isn't broken
  // by transformed ancestors (LanguageProvider wraps children in a div
  // with `animate-fadeIn`, which establishes a containing block).
  if (!mounted) return null;

  return createPortal(
    <>
      {/* Floating Quiky button (mirrors LiveSupportChat's pattern) */}
      <motion.button
        type="button"
        onClick={handleToggle}
        className={`fixed ${bottomBtn} ${sideClass} z-[60] ${buttonSize} rounded-full bg-gradient-to-br from-emerald-50 to-white shadow-xl ring-2 ring-[#25B181]/40 hover:ring-[#25B181] transition-shadow flex items-center justify-center ${
          isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
        }`}
        style={{
          paddingBottom: isMobile ? 'env(safe-area-inset-bottom, 0px)' : undefined,
          transition: 'transform 0.2s, opacity 0.2s',
        }}
        whileHover={{ scale: 1.08, rotate: -3 }}
        whileTap={{ scale: 0.95 }}
        animate={
          hasNudge
            ? { y: [0, -10, 0, -6, 0], rotate: [0, -8, 8, -4, 0] }
            : { y: [0, -3, 0] }
        }
        transition={
          hasNudge
            ? { duration: 1.2, repeat: 2 }
            : { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }
        }
        aria-label={`${strings.name} — ${strings.hint}`}
        aria-expanded={isOpen}
      >
        <img
          src={BUTTON_POSE}
          alt={strings.name}
          width={isMobile ? 48 : 56}
          height={isMobile ? 48 : 56}
          className="object-contain pointer-events-none select-none"
          draggable={false}
        />
        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
        <AnimatePresence>
          {hasNudge && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#25B181] flex items-center justify-center"
            >
              <Sparkles className="w-3 h-3 text-white" />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Tooltip beside the button to introduce Quiky on first visit */}
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.span
              initial={{ opacity: 0, x: isRtl ? -8 : 8, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 18, stiffness: 240 }}
              className={`absolute ${isRtl ? 'right-full mr-3' : 'left-full ml-3'} top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1.5 bg-white border border-gray-200 shadow-md rounded-full pl-3 pr-3 py-1.5 whitespace-nowrap`}
            >
              <span className="text-xs font-semibold text-[#25B181]">{strings.name}</span>
              <span className="text-[11px] text-gray-600">· {strings.hint}</span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Speech bubble panel — opens above the button on click */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-label={strings.name}
            dir={isRtl ? 'rtl' : 'ltr'}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className={`fixed ${bottomPanel} ${sideClass} z-[60] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col`}
            style={{
              width: isMobile ? 'calc(100vw - 1.5rem)' : '340px',
              maxWidth: isMobile ? 'calc(100vw - 1.5rem)' : '340px',
              maxHeight: isMobile ? '70vh' : '520px',
            }}
          >
            {/* Header — buttons sit absolute in the top-right; mascot is stacked above name/hint */}
            <div className="relative bg-gradient-to-b from-[#25B181] to-[#1F8F68] px-4 pt-3 pb-4">
              <div className="absolute top-2 right-2 flex items-center gap-1">
                {speechSupported.current && (
                  <button
                    type="button"
                    onClick={handleToggleAudio}
                    className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                    aria-label={audioEnabled ? strings.audioOff : strings.audioOn}
                    aria-pressed={audioEnabled}
                  >
                    {audioEnabled ? (
                      <Volume2 className="w-5 h-5 text-white" />
                    ) : (
                      <VolumeX className="w-5 h-5 text-white" />
                    )}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                  aria-label={strings.close}
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-24 h-24 rounded-full bg-white/95 ring-2 ring-white/40 shadow-md flex items-center justify-center overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={headerPose}
                      src={headerPose}
                      alt={strings.name}
                      width={84}
                      height={84}
                      initial={{ scale: 0.6, rotate: -10, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      exit={{ scale: 0.7, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 280, damping: 16 }}
                      className="object-contain pointer-events-none select-none"
                      draggable={false}
                    />
                  </AnimatePresence>
                </div>
                <div>
                  <p className="text-white font-semibold text-base leading-tight">{strings.name}</p>
                  <p className="text-white/85 text-[11px] leading-tight flex items-center justify-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                    {strings.hint}
                  </p>
                </div>
              </div>
            </div>

            {/* Active topic message — same as the previous design */}
            <div className="px-4 py-4 bg-gradient-to-b from-emerald-50/40 to-white">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${language}-${activeTopic}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 border border-gray-100 shadow-sm"
                >
                  <p
                    aria-live="polite"
                    className="text-[13.5px] leading-relaxed text-gray-800 whitespace-pre-wrap"
                  >
                    {strings.messages[activeTopic]}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Topic list — stacked vertically, heading-only, with side mascot pose */}
            <div
              className="flex-1 overflow-y-auto px-3 pb-3 space-y-2"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {TOPIC_CARDS.map(({ key, pose }) => {
                const isActive = key === activeTopic;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleTopic(key)}
                    className={`group relative w-full text-start flex items-center gap-3 rounded-xl border transition-all overflow-hidden ${
                      isActive
                        ? 'bg-white border-[#25B181] shadow-sm'
                        : 'bg-white/80 border-gray-200 hover:border-[#25B181]/60'
                    }`}
                  >
                    <div className="shrink-0 w-12 h-12 bg-gradient-to-b from-[#25B181]/10 to-emerald-100/40 flex items-center justify-center relative">
                      <span className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,177,129,0.18),transparent_60%)]" />
                      <img
                        src={pose}
                        alt=""
                        width={40}
                        height={40}
                        className="relative object-contain pointer-events-none select-none"
                        draggable={false}
                        aria-hidden
                      />
                    </div>
                    <p
                      className={`flex-1 min-w-0 text-[13px] font-semibold leading-tight pr-3 ${
                        isActive ? 'text-[#1F8F68]' : 'text-gray-800'
                      }`}
                    >
                      {strings.topicLabels[key]}
                    </p>
                    {isActive && (
                      <span className="me-3 w-2 h-2 rounded-full bg-[#25B181] animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
}
