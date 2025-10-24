"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";

interface Trade {
  _id?: string;
  pair: string;
  type: string;
  result: string;
  note: string;
  sl: string;
  tp: string;
  lotSize: string;
  pl: string;
  createdAt?: string;
}

interface WinLossData {
  pair: string;
  win: number;
  loss: number;
  total: number;
  winRate: number;
}

interface PairPerformance {
  pair: string;
  totalProfit: number;
  totalLoss: number;
  netPL: number;
  tradeCount: number;
}

interface EquityData {
  date: string;
  equity: number;
  balance: number;
}

export default function HistoryPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [winLossData, setWinLossData] = useState<WinLossData[]>([]);
  const [pairPerformance, setPairPerformance] = useState<PairPerformance[]>([]);
  const [equityData, setEquityData] = useState<EquityData[]>([]);
  const [maxDrawdown, setMaxDrawdown] = useState(0);
  const [avgRiskPerTrade, setAvgRiskPerTrade] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const COLORS = ['#22c55e', '#ef4444', '#eab308', '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#f43f5e'];

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/');
      return;
    }
    fetchHistoryData();
  }, [router]);

  const fetchHistoryData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/trades', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const tradesData = await response.json();
        setTrades(tradesData);
        processHistoryData(tradesData);
      }
    } catch (error) {
      console.error("Error fetching history data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const processHistoryData = (tradesData: Trade[]) => {
    // Process Win/Loss per Pair
    const pairStats = new Map<string, { win: number; loss: number; total: number }>();
    
    // Process Pair Performance for Heatmap
    const performanceMap = new Map<string, { totalProfit: number; totalLoss: number; tradeCount: number }>();
    
    // Process Equity Curve
    const equityCurve: EquityData[] = [];
    let runningBalance = 0;
    let peakEquity = 0;
    let maxDrawdownValue = 0;

    // Process Risk per Trade
    let totalRisk = 0;
    let riskTradeCount = 0;

    tradesData
      .sort((a, b) => new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime())
      .forEach(trade => {
        // Win/Loss per Pair
        const pair = trade.pair;
        if (!pairStats.has(pair)) {
          pairStats.set(pair, { win: 0, loss: 0, total: 0 });
        }
        const stats = pairStats.get(pair)!;
        stats.total++;
        if (trade.result === 'Profit') stats.win++;
        if (trade.result === 'Loss') stats.loss++;

        // Pair Performance
        if (!performanceMap.has(pair)) {
          performanceMap.set(pair, { totalProfit: 0, totalLoss: 0, tradeCount: 0 });
        }
        const performance = performanceMap.get(pair)!;
        performance.tradeCount++;
        const plValue = parseFloat(trade.pl) || 0;
        if (plValue > 0) performance.totalProfit += plValue;
        if (plValue < 0) performance.totalLoss += Math.abs(plValue);

        // Equity Curve
        runningBalance += plValue;
        peakEquity = Math.max(peakEquity, runningBalance);
        const drawdown = ((peakEquity - runningBalance) / peakEquity) * 100;
        maxDrawdownValue = Math.max(maxDrawdownValue, drawdown);

        equityCurve.push({
          date: new Date(trade.createdAt || '').toLocaleDateString('id-ID'),
          equity: runningBalance,
          balance: runningBalance
        });

        // Risk per Trade (using SL and Lot Size as proxy)
        const lotSize = parseFloat(trade.lotSize) || 0;
        const sl = parseFloat(trade.sl) || 0;
        if (lotSize > 0 && sl > 0) {
          totalRisk += lotSize * sl * 10; // Simplified risk calculation
          riskTradeCount++;
        }
      });

    // Convert Win/Loss data
    const winLossArray: WinLossData[] = Array.from(pairStats.entries()).map(([pair, stats]) => ({
      pair,
      win: stats.win,
      loss: stats.loss,
      total: stats.total,
      winRate: stats.total > 0 ? (stats.win / stats.total) * 100 : 0
    })).sort((a, b) => b.total - a.total);

    // Convert Performance data
    const performanceArray: PairPerformance[] = Array.from(performanceMap.entries()).map(([pair, data]) => ({
      pair,
      totalProfit: data.totalProfit,
      totalLoss: data.totalLoss,
      netPL: data.totalProfit - data.totalLoss,
      tradeCount: data.tradeCount
    })).sort((a, b) => b.netPL - a.netPL);

    setWinLossData(winLossArray);
    setPairPerformance(performanceArray);
    setEquityData(equityCurve);
    setMaxDrawdown(maxDrawdownValue);
    setAvgRiskPerTrade(riskTradeCount > 0 ? totalRisk / riskTradeCount : 0);
  };

  const StatCard = ({ title, value, subtitle, color = "blue" }: {
    title: string;
    value: string | number;
    subtitle: string;
    color?: "blue" | "red" | "green" | "yellow";
  }) => {
    const colorClasses = {
      blue: "bg-blue-600",
      red: "bg-red-600",
      green: "bg-green-600",
      yellow: "bg-yellow-600"
    };

    return (
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:bg-gray-750 transition duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white mt-2">{value}</p>
            <p className="text-sm text-gray-300 mt-1">{subtitle}</p>
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900">
      <Navbar />

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Trading History & Analytics</h1>
            <p className="text-gray-400 mt-2">Analisis mendalam performa trading Anda</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Max Drawdown"
              value={`${maxDrawdown.toFixed(2)}%`}
              subtitle="Penurunan maksimal"
              color="red"
            />
            <StatCard
              title="Risk Per Trade"
              value={`$${avgRiskPerTrade.toFixed(2)}`}
              subtitle="Rata-rata risk"
              color="yellow"
            />
            <StatCard
              title="Total Trades"
              value={trades.length}
              subtitle="Seluruh periode"
              color="blue"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Win/Loss per Pair */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-white mb-6">Win/Loss Ratio per Pair</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={winLossData.slice(0, 8)}>
                    <XAxis dataKey="pair" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#D1D5DB' }}
                    />
                    <Legend />
                    <Bar dataKey="win" name="Win" fill="#22c55e" />
                    <Bar dataKey="loss" name="Loss" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Equity Growth Curve */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-white mb-6">Equity Growth Curve</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={equityData}>
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#D1D5DB' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="equity" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Equity"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Detailed Performance Table */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-white mb-6">Detailed Pair Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                  <tr>
                    <th className="px-6 py-3">Currency Pair</th>
                    <th className="px-6 py-3">Total Trades</th>
                    <th className="px-6 py-3">Win Rate</th>
                    <th className="px-6 py-3">Total Profit</th>
                    <th className="px-6 py-3">Total Loss</th>
                    <th className="px-6 py-3">Net P/L</th>
                  </tr>
                </thead>
                <tbody>
                  {pairPerformance.map((pair) => (
                    <tr key={pair.pair} className="border-b border-gray-700 hover:bg-gray-750 transition duration-200">
                      <td className="px-6 py-4 font-medium text-white">{pair.pair}</td>
                      <td className="px-6 py-4">{pair.tradeCount}</td>
                      <td className="px-6 py-4">
                        {winLossData.find(w => w.pair === pair.pair)?.winRate.toFixed(1) || 0}%
                      </td>
                      <td className="px-6 py-4 text-green-400">+${pair.totalProfit.toFixed(2)}</td>
                      <td className="px-6 py-4 text-red-400">-${pair.totalLoss.toFixed(2)}</td>
                      <td className={`px-6 py-4 font-semibold ${
                        pair.netPL > 0 ? 'text-green-400' : 
                        pair.netPL < 0 ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        {pair.netPL > 0 ? '+' : ''}${pair.netPL.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}