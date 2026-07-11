import { useEffect, useRef, useState } from 'react';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function GoogleSignInButton({ onCredential, text = 'continue_with' }) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!CLIENT_ID) return;
    let cancelled = false;

    const render = () => {
      if (cancelled || !window.google || !ref.current) return;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: res => onCredential(res.credential),
      });
      window.google.accounts.id.renderButton(ref.current, {
        theme: 'filled_black',
        size: 'large',
        shape: 'rectangular',
        text,
        width: 320,
      });
      setReady(true);
    };

    if (window.google?.accounts?.id) render();
    else {
      const script = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
      script?.addEventListener('load', render);
      return () => script?.removeEventListener('load', render);
    }
    return () => { cancelled = true; };
  }, [onCredential, text]);

  if (!CLIENT_ID) {
    return (
      <button type="button" disabled className="w-full py-3 border border-[#2a2a2a] text-[#444] text-sm cursor-not-allowed">
        Google sign-in not configured
      </button>
    );
  }

  return <div ref={ref} className={ready ? '' : 'h-11 bg-[#111] border border-[#2a2a2a] animate-pulse'} />;
}
