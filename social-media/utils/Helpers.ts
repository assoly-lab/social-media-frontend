import { useEffect, useState } from "react";

// Helper function to check if the access token is expired
export function isTokenExpired(token: string): boolean {
    const payload = JSON.parse(atob(token.split('.')[1])); // Decode token payload
    const expiryTime = payload.exp * 1000; // Convert expiry to milliseconds
    return Date.now() > expiryTime; // Check if token is expired
}

// Handle what happens when the refresh token expires (e.g., log out the user)
async function handleTokenExpiry() {
    try {
        // Call the logout API endpoint
        await fetch('http://localhost:8000/api/auth/jwt/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include HTTP-only cookies if necessary
        });

        // Clear tokens from localStorage
        localStorage.removeItem('access');
        window.location.href = '/login'
    } catch (error) {
        console.error('Error logging out:', error);
    } 
    // finally {
    //     // Redirect the user to the login page
    //     // router.push('/login'); // Or display a session expired message
    // }
}

// Function to request a new access token using the refresh token (stored in an HTTP-only cookie)
async function refreshAccessToken(): Promise<string> {
    try {
        const response = await fetch('http://localhost:8000/api/auth/jwt/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include HTTP-only cookies
        });

        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = '/login'
                throw new Error('Refresh token expired or invalid');

            }
            throw new Error('Failed to refresh access token');
        }

        const data = await response.json();
        localStorage.setItem('access', data.access); // Save the new access token
        return data.access;
    } catch (error) {
        console.error('Error refreshing access token:', error);
        await handleTokenExpiry(); // Call the logout API if token refresh fails
        throw error; // Rethrow the error for further handling
    }
}

// Wrapper function for fetch with silent token refreshing
export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    let accessToken = localStorage.getItem('access');


    // Refresh the token if it's expired
    if (accessToken && isTokenExpired(accessToken)) {
        try {
            accessToken = await refreshAccessToken();
        } catch (error) {
            return Promise.reject('Token refresh failed');
        }
    }

    // Proceed with the original request using the (refreshed) access token
    const modifiedOptions: RequestInit = {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${accessToken}`,
        },
    };

    return fetch(url, modifiedOptions);
}

