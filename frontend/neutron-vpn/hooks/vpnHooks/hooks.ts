"use client";

import { useState, useEffect, useRef } from "react";

export function useVPNStats(interfaceName: string, isConnected: boolean) {
  const [interfaceIP, setInterfaceIP] = useState("-");
  const [publicIP, setPublicIP] = useState("-");
  const [isLoadingPublicIP, setIsLoadingPublicIP] = useState(true);
  const [isLoadingInterfaceIP, setIsLoadingInterfaceIP] = useState(false);

  useEffect(() => {
    // Always fetch public IP, even if not connected
    const fetchPublicIP = async () => {
      setIsLoadingPublicIP(true);
      try {
        const pub = await window.vpnAPI.getPublicIP();
        if (pub) setPublicIP(pub);
      } catch (err) {
        console.error("Error fetching public IP:", err);
      } finally {
        setIsLoadingPublicIP(false);
      }
    };

    fetchPublicIP();
    const pubInterval = setInterval(fetchPublicIP, 10000); // refresh every 10s

    // Only fetch interface IP if connected
    let ifaceInterval = null;

    if (isConnected && interfaceName) {
      const fetchInterfaceIP = async () => {
        setIsLoadingInterfaceIP(true);
        try {
          const iface = await window.vpnAPI.getInterfaceIP(interfaceName);
          if (iface) setInterfaceIP(iface);
        } catch (err) {
          console.error("Error fetching interface IP:", err);
        } finally {
          setIsLoadingInterfaceIP(false);
        }
      };

      fetchInterfaceIP();
      ifaceInterval = setInterval(fetchInterfaceIP, 5000); // refresh every 5s
    } else {
      setInterfaceIP("-");
      setIsLoadingInterfaceIP(false);
    }

    // Cleanup
    return () => {
      clearInterval(pubInterval);
      if (ifaceInterval) clearInterval(ifaceInterval);
    };
  }, [interfaceName, isConnected]);

  return { interfaceIP, publicIP, isLoadingPublicIP, isLoadingInterfaceIP };
}

export function useConnectionStatus() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check connection status from localStorage or API
    const checkConnectionStatus = async () => {
      try {
        const status = await window.vpnAPI.getConnectionStatus();
        setIsConnected(status);
      } catch (err) {
        console.error("Error checking connection status:", err);
        setIsConnected(false);
      }
    };

    checkConnectionStatus();
    const interval = setInterval(checkConnectionStatus, 2000); // check every 2s

    return () => clearInterval(interval);
  }, []);

  return isConnected;
}

export function useVPNSpeed(isConnected: boolean) {
  const [downloadSpeed, setDownloadSpeed] = useState("-");
  const [uploadSpeed, setUploadSpeed] = useState("-");
  const prevStats = useRef<{ rx: number; tx: number } | null>(null);

  useEffect(() => {
    if (!isConnected) {
      setDownloadSpeed("-");
      setUploadSpeed("-");
      prevStats.current = null;
      return;
    }

    const fetchSpeed = async () => {
      try {
        const stats = await window.vpnAPI.getSpeed();
        if (prevStats.current) {
          const rxDiff = stats.rx - prevStats.current.rx;
          const txDiff = stats.tx - prevStats.current.tx;

          // Bytes per second -> Megabits per second
          const downMbps = ((rxDiff * 8) / 1_000_000).toFixed(2);
          const upMbps = ((txDiff * 8) / 1_000_000).toFixed(2);

          setDownloadSpeed(`${downMbps} Mbps`);
          setUploadSpeed(`${upMbps} Mbps`);
        }
        prevStats.current = stats;
      } catch (err) {
        console.error("Error fetching speed:", err);
      }
    };

    fetchSpeed();
    const interval = setInterval(fetchSpeed, 2000); // refresh every 2s
    return () => clearInterval(interval);
  }, [isConnected]);

  return { downloadSpeed, uploadSpeed };
}
