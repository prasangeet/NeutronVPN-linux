import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/";

// -------------------- TypeScript types --------------------
export interface VPNServer {
  id: number;
  name: string;
  ip_address: string;
  location: string;
  port: number;
  public_key: string;
}

export interface VPNClient {
  id: number;
  vpn_server: string;
  assigned_ip: string;
  client_public_key: string;
  created_at: string;
}

// -------------------- API Functions --------------------

/**
 * Fetch all VPN servers
 */
export const listServers = async (token: string): Promise<VPNServer[]> => {
  const res = await axios.get(`${API_BASE_URL}vpn/servers/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.servers;
};

/**
 * Fetch all VPN clients for the logged-in user
 */
export const listClients = async (token: string): Promise<VPNClient[]> => {
  const res = await axios.get(`${API_BASE_URL}vpn/clients/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.clients;
};

/**
 * Get or create a VPN client for a specific server
 */
export const getOrCreateClient = async (
  serverName: string,
  serverId: number,
  userName: string,
  token: string
): Promise<VPNClient> => {
  const clients = await listClients(token);

  // Try to find existing client for this server
  let client = clients.find((c) => c.vpn_server === serverName);

  // If none exists, create a new client
  if (!client) {
    const res = await axios.post(
      `${API_BASE_URL}vpn/clients/add/`,
      { name: userName, server_id: serverId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    client = res.data.client;
  }

  // At this point, client is guaranteed to exist
  if (!client) {
    throw new Error("Failed to create or fetch VPN client");
  }

  return client;
};
/**
 * Get VPN client config
 */
export const getClientConfig = async (
  clientId: number,
  token: string
): Promise<string> => {
  const res = await axios.get(
    `${API_BASE_URL}vpn/clients/${clientId}/config/`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data.config;
};

// -------------------- Electron VPN helpers --------------------
export const connectVPN = async (
  serverName: string,
  serverId: number,
  userName: string,
  token: string
) => {
  if (typeof window === "undefined" || !window.vpnAPI) {
    throw new Error("vpnAPI not available – must run inside Electron!");
  }

  const client = await getOrCreateClient(serverName, serverId, userName, token);
  const configData = await getClientConfig(client.id, token);

  // Define the simple filename
  const filename = `NeutronVPN.conf`;

  // Save config locally (this is fine)
  await window.vpnAPI.saveConfig(filename, configData);

  // --- FIX ---
  // Pass ONLY the filename. main.js will handle the rest.
  await window.vpnAPI.connect(filename);

  // Return the filename for use in the disconnect function
  return { client, configPath: filename };
};

export const disconnectVPN = async (clientId: number) => {
  if (typeof window === "undefined" || !window.vpnAPI) {
    throw new Error("vpnAPI not available – must run inside Electron!");
  }

  // --- FIX ---
  // No need to ask Electron for the path.
  // Just create the same filename you used to connect.
  const filename = `NeutronVPN.conf`;

  // Pass the filename directly. main.js will find the full path.
  await window.vpnAPI.disconnect(filename);
};
