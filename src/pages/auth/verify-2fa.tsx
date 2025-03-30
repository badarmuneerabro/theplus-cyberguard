import Verify2FA from '@/components/2FA/Verify2FA';

export default function Verify2FAPage() {
  const userEmail = "user@example.com";  // Replace this with the actual logged-in user's email

  return (
    <div>
      <h2>Verify 2FA</h2>
      <Verify2FA email={userEmail} />
    </div>
  );
}
