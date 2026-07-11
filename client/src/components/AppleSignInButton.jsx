// Enable once Apple Developer Program enrollment + Services ID + domain verification are complete.
// Wire it up the same way as GoogleSignInButton: initialize AppleID.auth with clientId/redirectURI,
// then POST the returned identityToken to /api/account/apple (mirroring /api/account/google).
export default function AppleSignInButton() {
  return (
    <button
      type="button"
      disabled
      title="Coming soon — requires Apple Developer Program enrollment"
      className="w-full py-3 border border-[#24402f] text-[#444] text-sm flex items-center justify-center gap-2 cursor-not-allowed"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.365 1.43c0 1.14-.415 2.19-1.24 3.037-.995 1.03-2.187 1.616-3.396 1.512-.09-1.113.435-2.256 1.253-3.06C13.968.685 15.213.09 16.24.06c.075.457.125.918.125 1.37zM20.933 17.24c-.535 1.242-1.19 2.417-1.98 3.505-1.08 1.494-2.187 2.99-3.926 3.02-1.687.03-2.23-1.02-4.157-1.02-1.926 0-2.53 1-4.128 1.05-1.673.06-2.95-1.615-4.037-3.104C.72 17.98-.585 12.99 1.03 9.62c.803-1.68 2.238-2.744 3.807-2.77 1.61-.03 2.622 1.09 3.955 1.09 1.328 0 2.107-1.09 3.958-1.09 1.34 0 2.76.735 3.775 2.004-3.32 1.82-2.78 6.556.407 8.386z"/>
      </svg>
      Continue with Apple
    </button>
  );
}
