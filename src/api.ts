import { VideoResponse } from './types';

// Galaxy API configuration
const GALAXY_API_BASE_URL = 'https://galaxy-api.galaxydve.com';
const GALAXY_API_KEY = 'api_key_iatest';
const GALAXY_API_SECRET = 'GaLxAiDviTS12*';
const GALAXY_CAMPAIGN_ID = '5027';
const GALAXY_SERVICE_ID = '39'; // Using default service ID
const GALAXY_COUNTRY_CODE = 'gb';
const GALAXY_LANGUAGE_CODE = 'en';

// Type definitions for Galaxy API
export interface GalaxyRubric {
  rubric_id: string;
  rubric_title: string;
  rubric_description: string;
  contents_count: number;
  rubric_label: string; // Added rubric_label field
}

export interface GalaxyRubricResponse {
  code: number;
  data: {
    data: GalaxyRubric[];
  };
}

/**
 * Fetches videos from the Galaxy API
 */
export const fetchVideos = async (rubricId?: string): Promise<VideoResponse> => {
  try {
    console.log('Fetching videos from Galaxy API...');
    
    const params = new URLSearchParams({
      api_key: GALAXY_API_KEY,
      api_secret_key: GALAXY_API_SECRET,
      country_code: GALAXY_COUNTRY_CODE,
      language_code: GALAXY_LANGUAGE_CODE,
      campaign_id: GALAXY_CAMPAIGN_ID,
      service_id: GALAXY_SERVICE_ID,
      content_type: 'movie,tv_movie,series,series_episode',
      preview: 'true',
      asset: 'true',
      delivery: 'true',
      without_token: 'true',
      itemsPerPage: '100',
      page: '1'
    });

    if (rubricId) {
      params.append('rubric_id', rubricId);
    }

    const url = `${GALAXY_API_BASE_URL}/publishing-content-list?${params.toString()}`;
    console.log(`Making API request to: ${url}`);

    const response = await fetch(url);
    console.log('API response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API response data:', data);
    
    if (data.code !== 200) {
      throw new Error(`API error: ${data.message || 'Unknown error'}. Code: ${data.code}`);
    }

    return data as VideoResponse;
  } catch (error) {
    console.error('Error fetching videos from Galaxy API:', error);
    throw error;
  }
};

/**
 * Fetches available rubrics from the Galaxy API
 */
export const fetchRubrics = async (): Promise<GalaxyRubricResponse> => {
  try {
    console.log('Fetching rubrics from Galaxy API...');
    
    const params = new URLSearchParams({
      api_key: GALAXY_API_KEY,
      api_secret_key: GALAXY_API_SECRET,
      country_code: GALAXY_COUNTRY_CODE,
      language_code: GALAXY_LANGUAGE_CODE,
      campaign_id: GALAXY_CAMPAIGN_ID,
      service_id: GALAXY_SERVICE_ID
    });

    const url = `${GALAXY_API_BASE_URL}/publishing-rubric-list?${params.toString()}`;
    console.log(`Making API request to: ${url}`);
    
    const response = await fetch(url);
    console.log('API response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API response data:', data);
    
    if (data.code !== 200) {
      throw new Error(`API error: ${data.message || 'Unknown error'}. Code: ${data.code}`);
    }

    return data as GalaxyRubricResponse;
  } catch (error) {
    console.error('Error fetching rubrics from Galaxy API:', error);
    throw error;
  }
};

/**
 * Fetches content details for a specific video ID
 */
export const fetchContentDetails = async (contentId: string): Promise<VideoResponse> => {
  try {
    console.log(`Fetching content details for ID: ${contentId}`);
    
    const params = new URLSearchParams({
      api_key: GALAXY_API_KEY,
      api_secret_key: GALAXY_API_SECRET,
      country_code: GALAXY_COUNTRY_CODE,
      language_code: GALAXY_LANGUAGE_CODE,
      campaign_id: GALAXY_CAMPAIGN_ID,
      service_id: GALAXY_SERVICE_ID,
      content_id: contentId,
      preview: 'true',
      asset: 'true',
      delivery: 'true'
    });

    const url = `${GALAXY_API_BASE_URL}/publishing-content-detail?${params.toString()}`;
    console.log(`Making API request to: ${url}`);
    
    const response = await fetch(url);
    console.log('API response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API response data:', data);
    
    if (data.code !== 200) {
      throw new Error(`API error: ${data.message || 'Unknown error'}. Code: ${data.code}`);
    }

    return data as VideoResponse;
  } catch (error) {
    console.error('Error fetching content details from Galaxy API:', error);
    throw error;
  }
};

/**
 * Search for content by title
 */
export const searchContent = async (searchTerm: string): Promise<VideoResponse> => {
  try {
    console.log(`Searching content for term: "${searchTerm}"`);
    
    const params = new URLSearchParams({
      api_key: GALAXY_API_KEY,
      api_secret_key: GALAXY_API_SECRET,
      country_code: GALAXY_COUNTRY_CODE,
      language_code: GALAXY_LANGUAGE_CODE,
      campaign_id: GALAXY_CAMPAIGN_ID,
      service_id: GALAXY_SERVICE_ID,
      content_type: 'movie,tv_movie,series,series_episode',
      content_title: searchTerm,
      preview: 'true',
      asset: 'true',
      delivery: 'true',
      without_token: 'true',
      itemsPerPage: '100',
      page: '1'
    });

    const url = `${GALAXY_API_BASE_URL}/publishing-content-list?${params.toString()}`;
    console.log(`Making API request to: ${url}`);
    
    const response = await fetch(url);
    console.log('API response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API response data:', data);
    
    if (data.code !== 200) {
      throw new Error(`API error: ${data.message || 'Unknown error'}. Code: ${data.code}`);
    }

    return data as VideoResponse;
  } catch (error) {
    console.error('Error searching content:', error);
    throw error;
  }
};

// Import these from services/api for authentication
import sha1 from 'js-sha1';

const API_BASE_URL = 'https://userv1-pp.dv-content.io';
const PRODUCT_ID = '2500'; 
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