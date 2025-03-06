
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './index.css';

// Get the publishable key from environment variables
const CLERK_PUBLISHABLE_KEY = "pk_test_cm9idXN0LW9yY2EtNDUuY2xlcmsuYWNjb3VudHMuZGV2JA";

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={CLERK_PUBLISHABLE_KEY}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>,
);
