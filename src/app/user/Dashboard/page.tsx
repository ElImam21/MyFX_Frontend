"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import Link from 'next/link';

interface DashboardStats {
  totalPl: number;
  winRate: number;
  totalTrades: number;
  monthlyGrowth: number;
}

interface Trade {
  _id?: string;
  pair: string;
  result: string;
  pl: string;
  createdAt?: string;
}

interface ApiResponse {
  success: boolean;
  totalPl?: number;
  status?: string;
  totalTrades?: number;
  winRate?: number;
  total?: number;
  wins?: number;
  losses?: number;
  message?: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPl: 0,
    winRate: 0,
    totalTrades: 0,
    monthlyGrowth: 0
  });
  const [recentTrades, setRecentTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/');
      return;
    }
  }, [router]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        
        // Fetch semua data secara paralel
        const [plResponse, tradesResponse, winRateResponse] = await Promise.all([
          fetch('/api/stats/totalpl', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch('/api/stats/totaltrades', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch('/api/stats/winrate', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        ]);

        const plData: ApiResponse = await plResponse.json();
        const tradesData: ApiResponse = await tradesResponse.json();
        const winRateData: ApiResponse = await winRateResponse.json();

        // Update state dengan data dari backend
        setStats({
          totalPl: plData.success ? plData.totalPl || 0 : 0,
          totalTrades: tradesData.success ? tradesData.totalTrades || 0 : 0,
          winRate: winRateData.success ? winRateData.winRate || 0 : 0,
          monthlyGrowth: 12.3 // Tetap menggunakan dummy data untuk monthlyGrowth
        });

        // Fetch recent trades (Anda perlu membuat API untuk ini)
        const recentTradesResponse = await fetch('/api/stats/tradeterbaru', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (recentTradesResponse.ok) {
          const recentTradesData = await recentTradesResponse.json();
          setRecentTrades(recentTradesData.trades || []);
        } else {
          // Fallback ke data dummy jika API belum tersedia
          setRecentTrades([
            { _id: '1', pair: 'EUR/USD', result: 'Profit', pl: '+245.50', createdAt: new Date().toISOString() },
            { _id: '2', pair: 'GBP/JPY', result: 'Loss', pl: '-120.25', createdAt: new Date().toISOString() },
            { _id: '3', pair: 'USD/CAD', result: 'Profit', pl: '+189.75', createdAt: new Date().toISOString() },
            { _id: '4', pair: 'AUD/USD', result: 'Profit', pl: '+315.20', createdAt: new Date().toISOString() },
            { _id: '5', pair: 'XAU/USD', result: 'Break Even', pl: '0.00', createdAt: new Date().toISOString() },
          ]);
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, subtitle, trend, icon }: { 
    title: string; 
    value: string | number; 
    subtitle: string; 
    trend?: number; 
    icon: React.ReactNode;
  }) => (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:bg-gray-750 transition duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-white mt-2">{value}</p>
          <div className="flex items-center mt-1">
            <p className="text-sm text-gray-300">{subtitle}</p>
            {trend !== undefined && (
              <span className={`ml-2 text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {trend >= 0 ? '↗' : '↘'} {Math.abs(trend)}%
              </span>
            )}
          </div>
        </div>
        <div className="text-blue-500">
          {icon}
        </div>
      </div>
    </div>
  );

  const ProgressBar = ({ percentage, color }: { percentage: number; color: string }) => (
    <div className="w-full bg-gray-700 rounded-full h-2">
      <div 
        className={`h-2 rounded-full ${color}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );

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
            <h1 className="text-3xl font-bold text-white">Dashboard Trading</h1>
            <p className="text-gray-400 mt-2">Ringkasan performa trading Anda</p>
          </div>

          {/* Stats Grid - Hanya 3 card sekarang */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Total Profit/Loss"
              value={`$${stats.totalPl.toFixed(2)}`}
              subtitle="Bulan Ini"
              trend={stats.monthlyGrowth}
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              }
            />

             <StatCard
              title="Win Rate"
              value={`${stats.winRate.toFixed(1)}%`}
              subtitle="Rasio Kemenangan"
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />

            <StatCard
              title="Total Trades"
              value={stats.totalTrades}
              subtitle="Bulan Ini"
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Performance Chart Section */}
            <div className="lg:col-span-2 bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-white mb-6">Statistik Performa</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm text-gray-300 mb-2">
                    <span>Profit Trades</span>
                    <span>68%</span>
                  </div>
                  <ProgressBar percentage={68} color="bg-green-500" />
                </div>

                <div>
                  <div className="flex justify-between text-sm text-gray-300 mb-2">
                    <span>Loss Trades</span>
                    <span>24%</span>
                  </div>
                  <ProgressBar percentage={24} color="bg-red-500" />
                </div>

                <div>
                  <div className="flex justify-between text-sm text-gray-300 mb-2">
                    <span>Break Even</span>
                    <span>8%</span>
                  </div>
                  <ProgressBar percentage={8} color="bg-yellow-500" />
                </div>
              </div>

              {/* Mini Chart Placeholder */}
              <div className="mt-8 p-4 bg-gray-750 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-white">Profit/Loss 30 Hari</h4>
                  <span className="text-green-500 text-sm font-medium">+12.3%</span>
                </div>
                <div className="h-32 bg-gray-700 rounded flex items-center justify-center">
                  <div className="text-gray-400 text-center">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                    <p className="text-sm">Chart akan ditampilkan di sini</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Trades */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Trade Terbaru</h3>
                <Link href="/Journal" className="text-blue-500 text-sm cursor-pointer hover:text-blue-400 transition duration-200">
                  Lihat Semua
                </Link>
              </div>

              <div className="space-y-4">
                {recentTrades.map((trade) => (
                  <div key={trade._id} className="flex items-center justify-between p-3 bg-gray-750 rounded-lg hover:bg-gray-700 transition duration-200">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        trade.result === 'Profit' ? 'bg-green-500' : 
                        trade.result === 'Loss' ? 'bg-red-500' : 
                        'bg-yellow-500'
                      }`}></div>
                      <div>
                        <p className="text-white font-medium">{trade.pair}</p>
                        <p className="text-gray-400 text-sm">{trade.result}</p>
                      </div>
                    </div>
                    <span className={`font-semibold ${
                      trade.pl.startsWith('+') ? 'text-green-500' : 
                      trade.pl.startsWith('-') ? 'text-red-500' : 
                      'text-yellow-500'
                    }`}>
                      {trade.pl}
                    </span>
                  </div>
                ))}
              </div>

              {/* Add Trade Button */}
              <div className="mt-6 pt-4 border-t border-gray-700">
                <Link 
                  href="/user/Journal"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Tambah Trade Baru
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Section - Hanya Pair Terpopuler */}
          <div className="mt-8">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Pair Terpopuler</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['EUR/USD', 'GBP/JPY', 'XAU/USD'].map((pair, index) => (
                  <div key={pair} className="bg-gray-750 rounded-lg p-4 hover:bg-gray-700 transition duration-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">{pair}</span>
                      <span className="text-blue-500 font-medium">{68 - index * 15}% Win Rate</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-300">
                      <span>Total Trades: {24 - index * 6}</span>
                      <span className={index === 0 ? "text-green-500" : index === 1 ? "text-yellow-500" : "text-red-500"}>
                        {index === 0 ? "+$842" : index === 1 ? "+$315" : "-$89"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}