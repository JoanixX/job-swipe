// Google OAuth configuration and utilities
export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

export interface GoogleAuthResponse {
  credential: string;
  select_by: string;
}

// Initialize Google OAuth
export const initializeGoogleAuth = () => {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Google Auth can only be initialized in browser'));
      return;
    }

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com',
          callback: () => {}, // Will be set per component
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        resolve();
      } else {
        reject(new Error('Google Identity Services failed to load'));
      }
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load Google Identity Services'));
    };
    
    document.head.appendChild(script);
  });
};

// Decode JWT token to get user info
export const decodeGoogleCredential = (credential: string): GoogleUser | null => {
  try {
    const base64Url = credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const payload = JSON.parse(jsonPayload);
    
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      given_name: payload.given_name,
      family_name: payload.family_name,
    };
  } catch (error) {
    console.error('Error decoding Google credential:', error);
    return null;
  }
};

// Trigger Google Sign-In
export const signInWithGoogle = (): Promise<GoogleUser> => {
  return new Promise((resolve, reject) => {
    if (!window.google) {
      reject(new Error('Google Identity Services not loaded'));
      return;
    }

    window.google.accounts.id.initialize({
      client_id: (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com',
      callback: (response: GoogleAuthResponse) => {
        const user = decodeGoogleCredential(response.credential);
        if (user) {
          resolve(user);
        } else {
          reject(new Error('Failed to decode user information'));
        }
      },
    });

    window.google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // Fallback to popup if prompt is not displayed
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'outline',
            size: 'large',
            width: '100%',
          }
        );
      }
    });
  });
};

// Global type declarations
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          renderButton: (element: HTMLElement | null, config: any) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}
