import { VideoResponse } from '../types';
import videoData from '../data/videoData';
import sha1 from 'js-sha1';

// In a real application, this would be a fetch call to the API
export const fetchVideos = (): Promise<VideoResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(videoData as VideoResponse);
    }, 300);
  });
};

const API_BASE_URL = 'https://userv1-pp.dv-content.io';
const PRODUCT_ID = '2500'; // Using the requested product ID
const SALT_PREFIX = 'f5c028c81f';
const SALT_SUFFIX = '560e6cd05c8513b96062b0';

export interface AuthResponse {
  code: number;
  error: number;
  data: {
    user_id: number | false;
  };
}

export interface UserInfo {
  user_id: string;
  email: string | null;
  msisdn: string | null;
  firstname: string | null;
  lastname: string | null;
  subscribed: boolean;
  country: string;
  // Add more fields as needed
}

export interface AccountInfoResponse {
  code: number;
  error: number;
  message?: string;
  data?: UserInfo[];
}

// Hash the password using the specified algorithm
export const hashPassword = (password: string): string => {
  return sha1(SALT_PREFIX + password + SALT_SUFFIX);
};

// Authenticate user with email or phone
export const authenticateUser = async (
  loginIdentifier: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const hashedPassword = hashPassword(password);
    const encodedLogin = encodeURIComponent(loginIdentifier);
    
    const url = `${API_BASE_URL}/login/dve?service_id=${PRODUCT_ID}&login=${encodedLogin}&password_dve=${hashedPassword}`;
    
    const response = await fetch(url);
    const data = await response.json();
    return data as AuthResponse;
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      code: 500,
      error: 1,
      data: {
        user_id: false
      }
    };
  }
};

// Get user account information
export const getUserInfo = async (userId: number): Promise<AccountInfoResponse> => {
  try {
    const url = `${API_BASE_URL}/accountinfo/all?service_id=${PRODUCT_ID}&user_id=${userId}`;
    const response = await fetch(url);
    const data = await response.json();
    return data as AccountInfoResponse;
  } catch (error) {
    console.error('Error fetching user info:', error);
    return {
      code: 500,
      error: 1,
      message: 'Failed to fetch user information'
    };
  }
};