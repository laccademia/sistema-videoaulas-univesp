import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function LoginRedirect() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redirecionar para a home (dashboard)
    setLocation('/');
  }, [setLocation]);

  return null;
}
