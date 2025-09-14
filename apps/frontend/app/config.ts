
// lib/config.js
export const VM_IP = process.env.NEXT_PUBLIC_VM_IP ;
export const BACKEND_PORT = process.env.NEXT_PUBLIC_BACKEND_PORT;
export const HOOK_PORT = process.env.NEXT_PUBLIC_HOOK_PORT;

// Construct URLs using the environment variables
export const BACKEND_URL = `http://${VM_IP}:${BACKEND_PORT}/api/v1`
export const HOOK_URL = `http://${VM_IP}:${HOOK_PORT}/hooks/catch/`
