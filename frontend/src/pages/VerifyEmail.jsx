import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { apiVerifyEmail } from '../utils/api';
import Button from '../components/common/Button';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided. Please check your email link.');
      return;
    }

    apiVerifyEmail(token)
      .then((data) => {
        setStatus('success');
        setMessage(data.message || 'Email verified successfully!');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.message || 'Verification failed. The link may be invalid or expired.');
      });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md card text-center py-10">
        {status === 'loading' && (
          <>
            <Loader size={48} className="text-green-primary mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold text-green-deep mb-2">Verifying your email…</h1>
            <p className="text-warm-gray">Please wait while we verify your account.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle size={48} className="text-green-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-green-deep mb-2">Email verified!</h1>
            <p className="text-warm-gray mb-6">{message}</p>
            <Link to="/signin">
              <Button className="w-full">Sign In</Button>
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle size={48} className="text-danger mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-green-deep mb-2">Verification failed</h1>
            <p className="text-warm-gray mb-6">{message}</p>
            <div className="flex gap-3 justify-center">
              <Link to="/signin">
                <Button variant="secondary">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
