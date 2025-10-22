"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  LogOut,
  Settings,
  Globe,
  Zap,
  Shield,
  ChevronDown,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { connectVPN } from "@/services/vpnServices/apiService";

interface VPNServer {
  id: number;
  name: string;
  country: string;
  flag: string;
  ping: number;
  load: number;
  available: boolean;
}

import {
  useVPNStats,
  useConnectionStatus,
  useVPNSpeed,
} from "@/hooks/vpnHooks/hooks";
import { Spinner } from "@/components/ui/spinner";

const VPN_SERVERS: VPNServer[] = [
  {
    id: 1,
    name: "Bengaluru",
    country: "India",
    flag: "🇮🇳",
    ping: 78,
    load: 71,
    available: true,
  },
  {
    id: 2,
    name: "New York",
    country: "United States",
    flag: "🇺🇸",
    ping: 12,
    load: 45,
    available: true,
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const isConnected = useConnectionStatus();
  const [selectedServer, setSelectedServer] = useState<VPNServer | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showServerList, setShowServerList] = useState(false);
  const [connectionTime, setConnectionTime] = useState(0);
  const [dataUsed, setDataUsed] = useState("0 MB");
  const { interfaceIP, publicIP, isLoadingPublicIP, isLoadingInterfaceIP } =
    useVPNStats("NeutronVPN", isConnected);
  const { downloadSpeed, uploadSpeed } = useVPNSpeed(isConnected);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const connectedServer = localStorage.getItem("connected_server");
    const name = localStorage.getItem("username") || "User";

    setUserName(name);

    if (connectedServer) {
      try {
        const server = JSON.parse(connectedServer) as VPNServer;
        console.log("Restoring connected server:", server);
        setSelectedServer(server);
      } catch (err) {
        console.error("Failed to parse connected server:", err);
        setSelectedServer(VPN_SERVERS[0]);
      }
    } else {
      setSelectedServer(VPN_SERVERS[0]);
    }

    setIsLoading(false);
  }, [router]);

  // Simulate connection timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        setConnectionTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  const handleConnect = async () => {
    setIsConnecting(true);

    const token = localStorage.getItem("auth_token");
    if (!token || !selectedServer) {
      router.push("/login");
      setIsConnecting(false);
      return;
    }

    try {
      // 1️⃣ Fetch or reuse VPN client and config
      const { client, configPath } = await connectVPN(
        selectedServer.name,
        selectedServer.id,
        userName,
        token
      );

      // 2️⃣ Connect WireGuard via Electron API
      await window.vpnAPI.connect(configPath);
      localStorage.setItem("connected_server", JSON.stringify(selectedServer));

      setConnectionTime(0);
    } catch (err) {
      console.error("Error connecting VPN:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!selectedServer) return;

    const token = localStorage.getItem("auth_token");
    if (!token) return;

    try {
      const { client, configPath } = await connectVPN(
        selectedServer.name,
        selectedServer.id,
        userName,
        token
      );

      // Disconnect via Electron API
      await window.vpnAPI.disconnect(configPath);
      localStorage.removeItem("connected_server");

      setConnectionTime(0);
    } catch (err) {
      console.error("Error disconnecting VPN:", err);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-glow">
          <div className="w-12 h-12 neutron-particle"></div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-4">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 neutron-particle opacity-20 animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-24 h-24 neutron-particle opacity-15 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 neutron-ring opacity-5 animate-orbit"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">NeutronVPN Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {userName}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/settings">
              <Button variant="outline" size="icon" className="bg-transparent">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Connection Card */}
          <div className="lg:col-span-2">
            <Card className="p-8 border-primary/20 bg-card/50 backdrop-blur">
              <div className="space-y-8">
                {/* Connection Status */}
                <div className="text-center">
                  <div className="mb-6">
                    <div
                      className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center border-4 transition-all ${
                        isConnected
                          ? "border-accent bg-accent/10 animate-pulse-glow"
                          : "border-muted bg-muted/10"
                      }`}
                    >
                      <Shield
                        className={`w-16 h-16 ${
                          isConnected ? "text-accent" : "text-muted-foreground"
                        }`}
                      />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">
                    {isConnected ? "Connected" : "Disconnected"}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {isConnected
                      ? `Connected to ${selectedServer?.name}`
                      : "Your connection is not protected"}
                  </p>
                </div>

                {/* Server Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">VPN Server</label>
                  <div className="relative">
                    <button
                      onClick={() => setShowServerList(!showServerList)}
                      className="w-full flex items-center justify-between p-3 bg-input border border-border/50 rounded-lg hover:border-primary/50 transition-colors"
                      disabled={isConnected}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{selectedServer?.flag}</span>
                        <div className="text-left">
                          <p className="font-medium">{selectedServer?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {selectedServer?.country}
                          </p>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          showServerList ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Server Dropdown */}
                    {showServerList && !isConnected && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/50 rounded-lg overflow-hidden z-20 shadow-lg">
                        {VPN_SERVERS.map((server) => (
                          <button
                            key={server.id}
                            onClick={() => {
                              setSelectedServer(server);
                              setShowServerList(false);
                            }}
                            className="w-full flex items-center justify-between p-3 hover:bg-primary/10 transition-colors border-b border-border/30 last:border-b-0"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{server.flag}</span>
                              <div className="text-left">
                                <p className="font-medium">{server.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {server.country}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-medium">
                                {server.ping}ms
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {server.load}% load
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Connection Stats */}
                {isConnected && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Connection Time
                      </p>
                      <p className="text-lg font-mono font-bold">
                        {formatTime(connectionTime)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Data Used
                      </p>
                      <p className="text-lg font-mono font-bold">{dataUsed}</p>
                    </div>
                  </div>
                )}

                {/* Connection Button */}
                <Button
                  onClick={isConnected ? handleDisconnect : handleConnect}
                  disabled={isConnecting}
                  className={`w-full py-6 text-lg font-semibold transition-all ${
                    isConnected
                      ? "bg-destructive hover:bg-destructive/90"
                      : "bg-primary hover:bg-primary/90"
                  }`}
                >
                  {isConnecting
                    ? "Connecting..."
                    : isConnected
                    ? "Disconnect"
                    : "Connect"}
                </Button>
              </div>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-4">
            {/* IP Address Card */}
            <Card className="p-4 border-primary/20 bg-card/50 backdrop-blur">
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-accent mt-1" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">
                    Your IP Address
                  </p>
                  {isLoadingPublicIP || isLoadingInterfaceIP ? (
                    <div className="flex items-center gap-2">
                      <Spinner className="size-4 text-accent" />
                      <span className="text-sm text-muted-foreground">
                        Fetching IP...
                      </span>
                    </div>
                  ) : (
                    <p className="font-mono text-sm font-bold break-all">
                      {isConnected
                        ? `${interfaceIP} | ${publicIP}`
                        : `${publicIP}`}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Speed Card */}
            <Card className="p-4 border-primary/20 bg-card/50 backdrop-blur">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Connection Speed
                  </p>
                  <p className="font-mono text-sm font-bold">
                    {isConnected ? (
                      <div className="font-mono text-sm font-bold">
                        <div className="flex items-center gap-2">
                          <ArrowDown className="w-4 h-4 text-green-500" />
                          {downloadSpeed}
                        </div>
                        <div className="flex items-center gap-2">
                          <ArrowUp className="w-4 h-4 text-blue-500" />
                          {uploadSpeed}
                        </div>
                      </div>
                    ) : (
                      <p className="font-mono text-sm font-bold">—</p>
                    )}
                  </p>
                </div>
              </div>
            </Card>

            {/* Security Status */}
            <Card className="p-4 border-primary/20 bg-card/50 backdrop-blur">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Security Status
                  </p>
                  <p
                    className={`text-sm font-bold ${
                      isConnected ? "text-accent" : "text-destructive"
                    }`}
                  >
                    {isConnected ? "Protected" : "Unprotected"}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
