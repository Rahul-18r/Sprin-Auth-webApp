import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BarChart3, User as UserIcon, ShieldCheck, Activity } from "lucide-react";
import useAuth from "@/auth/store";
import { useEffect, useState } from "react";
import { getUserStats } from "@/services/AuthService";
import { Spinner } from "@/components/ui/spinner";
import toast from "react-hot-toast";

type Stats = {
  totalLogins: number;
  securityScore: number;
  activeSessions: number;
};

function Userhome() {
  const user = useAuth((state) => state.user);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  const loadStats = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await getUserStats(user.id);
      setStats(data);
    } catch (err) {
      console.error(err);
      toast.error("Unable to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const statsList = [
    {
      title: "Total Logins",
      value: stats ? stats.totalLogins.toLocaleString() : "—",
      icon: <UserIcon className="w-8 h-8 text-primary" />,
    },
    {
      title: "Security Score",
      value: stats ? `${stats.securityScore}%` : "—",
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    },
    {
      title: "Active Sessions",
      value: stats ? stats.activeSessions.toString() : "—",
      icon: <Activity className="w-8 h-8 text-primary" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-8"
      >
        Dashboard Overview
      </motion.h1>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {statsList.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="bg-card/70 backdrop-blur-lg border-border rounded-2xl shadow-lg">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-muted rounded-xl">{stat.icon}</div>
                  <div>
                    <p className="text-muted-foreground text-sm">{stat.title}</p>
                    <h3 className="text-2xl font-semibold">{stat.value}</h3>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="bg-card/70 backdrop-blur-lg border-border rounded-2xl shadow-lg mb-10">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary" /> Recent Activity
            </h2>
            <ul className="space-y-3 text-muted-foreground">
              <li>• Logged in from Chrome (Windows)</li>
              <li>• Password updated</li>
              <li>• New device added to trusted list</li>
              <li>• Logged out from Safari (iPhone)</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      <div className="text-center">
        <Button onClick={loadStats} className="rounded-2xl px-8 text-lg">
          Refresh Stats
        </Button>
      </div>
    </div>
  );
}

export default Userhome;
