// Google Authentication utility functions

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Initialize Google Identity Services
export const initializeGoogleAuth = () => {
  if (typeof google !== 'undefined' && google.accounts) {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
      auto_select: false,
      cancel_on_tap_outside: true
    });
  }
};

// Handle Google Sign-In response
const handleGoogleResponse = async (response) => {
  try {
    const res = await fetch(`${API_URL}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ id_token: response.credential }),
    });

    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || 'Google authentication failed');
    }

    // Redirect to dashboard on success
    window.location.href = '/dashboard';
  } catch (error) {
    console.error('Google authentication error:', error);
    alert('Google Sign-In failed: ' + error.message);
  }
};

// Trigger Google Sign-In
export const signInWithGoogle = () => {
  if (typeof google !== 'undefined' && google.accounts) {
    google.accounts.id.prompt();
  } else {
    console.error('Google Identity Services not loaded');
    alert('Google Sign-In is not available. Please refresh the page.');
  }
};

// Render Google Sign-In button
export const renderGoogleButton = (elementId) => {
  if (typeof google !== 'undefined' && google.accounts) {
    google.accounts.id.renderButton(
      document.getElementById(elementId),
      {
        theme: 'outline',
        size: 'large',
        width: '100%',
        text: 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'left'
      }
    );
  }
};
