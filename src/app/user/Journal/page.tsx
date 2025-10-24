"use client";
import { useState, useEffect } from "react";
import Navbar from '@/components/navbar'; // Pastikan path ini sesuai dengan struktur folder Anda

interface Trade {
  _id?: string;           // ID unik dari MongoDB (optional biar gak error waktu POST)
  pair: string;
  type: string;
  result: string;
  note: string;
  sl: string;
  tp: string;
  lotSize: string;
  pl: string;
  createdAt?: string;     // waktu pembuatan data (optional)
}

export default function JournalPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    pair: "",
    type: "",
    result: "",
    note: "",
    sl: "",
    tp: "",
    lotSize: "",
    pl: ""
  });

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    try {
      const res = await fetch("/api/trades");
      const data = await res.json();
      setTrades(data);
    } catch (error) {
      console.error("Error fetching trades:", error);
    }
  };

  // Validasi input angka dengan titik
  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value;
    if (value === '' || /^-?[0-9]*\.?[0-9]*$/.test(value)) {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Validasi untuk catatan
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      note: e.target.value
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      pair: "",
      type: "",
      result: "",
      note: "",
      sl: "",
      tp: "",
      lotSize: "",
      pl: ""
    });
    setEditingId(null);
  };

  // Handle Edit
  const handleEdit = (trade: Trade) => {
    setFormData({
      pair: trade.pair,
      type: trade.type,
      result: trade.result,
      note: trade.note,
      sl: trade.sl,
      tp: trade.tp,
      lotSize: trade.lotSize,
      pl: trade.pl
    });
    setEditingId(trade._id ?? null);
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus trade ini?")) {
      return;
    }

    try {
      const res = await fetch(`/api/trades/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        fetchTrades(); // Refresh data
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Submit (Create & Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = editingId ? `/api/trades/${editingId}` : '/api/trades';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        resetForm();
        fetchTrades();
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900">
      <Navbar />

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <h2 className="ml-3 text-3xl font-extrabold text-white">Trading Journal</h2>
            </div>
            <p className="mt-2 text-sm text-gray-400">
              Catat dan analisis trading Anda
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-white mb-6">
                {editingId ? 'Edit Trade' : 'Tambah Trade Baru'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Currency Pair */}
                <div>
                  <label htmlFor="pair" className="block text-sm font-medium text-gray-300 mb-1">
                    Currency Pair
                  </label>
                  <select
                    id="pair"
                    name="pair"
                    required
                    className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    value={formData.pair}
                    onChange={(e) => setFormData(prev => ({ ...prev, pair: e.target.value }))}
                  >
                    <option value="">Pilih Currency Pair</option>
                    <option value="XAU/USD">XAU/USD</option>
                    <option value="USD/JPY">USD/JPY</option>
                    <option value="EUR/USD">EUR/USD</option>
                    <option value="AUD/USD">AUD/USD</option>
                    <option value="GBP/USD">GBP/USD</option>
                    <option value="USD/CAD">USD/CAD</option>
                    <option value="USD/CHF">USD/CHF</option>
                    <option value="BTC/USD">BTC/USD</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* SL (PIP) */}
                  <div>
                    <label htmlFor="sl" className="block text-sm font-medium text-gray-300 mb-1">
                      SL (PIP)
                    </label>
                    <input
                      id="sl"
                      name="sl"
                      type="text"
                      className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="0.00"
                      value={formData.sl}
                      onChange={(e) => handleNumberInput(e, 'sl')}
                    />
                  </div>

                  {/* TP (PIP) */}
                  <div>
                    <label htmlFor="tp" className="block text-sm font-medium text-gray-300 mb-1">
                      TP (PIP)
                    </label>
                    <input
                      id="tp"
                      name="tp"
                      type="text"
                      className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="0.00"
                      value={formData.tp}
                      onChange={(e) => handleNumberInput(e, 'tp')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Lot Size */}
                  <div>
                    <label htmlFor="lotSize" className="block text-sm font-medium text-gray-300 mb-1">
                      Lot Size
                    </label>
                    <input
                      id="lotSize"
                      name="lotSize"
                      type="text"
                      className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="0.00"
                      value={formData.lotSize}
                      onChange={(e) => handleNumberInput(e, 'lotSize')}
                    />
                  </div>

                  {/* Hasil P/L */}
                  <div>
                    <label htmlFor="pl" className="block text-sm font-medium text-gray-300 mb-1">
                      Hasil P/L
                    </label>
                    <input
                      id="pl"
                      name="pl"
                      type="text"
                      className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="0.00"
                      value={formData.pl}
                      onChange={(e) => handleNumberInput(e, 'pl')}
                    />
                  </div>
                </div>

                {/* Type */}
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">
                    Buy/Sell
                  </label>
                  <select
                    id="type"
                    name="type"
                    required
                    className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  >
                    <option value="">Pilih Tipe</option>
                    <option value="Buy">Buy</option>
                    <option value="Sell">Sell</option>
                  </select>
                </div>

                {/* Result */}
                <div>
                  <label htmlFor="result" className="block text-sm font-medium text-gray-300 mb-1">
                    Result
                  </label>
                  <select
                    id="result"
                    name="result"
                    required
                    className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    value={formData.result}
                    onChange={(e) => setFormData(prev => ({ ...prev, result: e.target.value }))}
                  >
                    <option value="">Pilih Result</option>
                    <option value="Profit">Profit</option>
                    <option value="Loss">Loss</option>
                    <option value="Break Even">Break Even</option>
                  </select>
                </div>

                {/* Catatan */}
                <div>
                  <label htmlFor="note" className="block text-sm font-medium text-gray-300 mb-1">
                    Catatan
                  </label>
                  <textarea
                    id="note"
                    name="note"
                    rows={3}
                    className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Tambahkan catatan trading Anda..."
                    value={formData.note}
                    onChange={handleNoteChange}
                  />
                </div>

                {/* Submit & Cancel Buttons */}
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex-1 flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Memproses...
                      </div>
                    ) : editingId ? (
                      'Update Trade'
                    ) : (
                      'Tambah Trade'
                    )}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 py-3 px-4 border border-gray-600 text-sm font-medium rounded-lg text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-200"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Trades List Section */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col">
              <h3 className="text-xl font-bold text-white mb-6">Riwayat Trading</h3>

              {trades.length === 0 ? (
                <div className="text-center py-8 flex-1 overflow-y-auto">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="mt-2 text-gray-400">Belum ada data trading</p>
                </div>
              ) : (
                <div className="space-y-4 overflow-y-auto flex-1 max-h-[90vh] pr-2 hide-scrollbar">
                  {trades.map((trade) => (
                    <div key={trade._id} className="border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition duration-200">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                            {trade.pair}
                            {trade.type && (
                              <span
                                className={`px-2 py-0.5 text-xs font-medium rounded-full ${trade.type === "Buy"
                                    ? "bg-green-600 text-white"
                                    : "bg-red-600 text-white"
                                  }`}
                              >
                                {trade.type}
                              </span>
                            )}
                          </h4>
                          {trade.createdAt && (
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(trade.createdAt).toLocaleString('id-ID')}
                            </p>
                          )}
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${trade.result === 'Profit' ? 'bg-green-500 text-white' :
                          trade.result === 'Loss' ? 'bg-red-500 text-white' :
                            'bg-yellow-500 text-gray-900'
                          }`}>
                          {trade.result}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-300 mb-3">
                        <div>SL: {trade.sl} PIP</div>
                        <div>TP: {trade.tp} PIP</div>
                        <div>Lot: {trade.lotSize}</div>
                        <div>P/L: {trade.pl}</div>
                      </div>

                      {trade.note && (
                        <div
                          className="text-sm text-gray-400 border-t border-gray-700 pt-3 mb-3 whitespace-pre-line"
                        >
                          {trade.note}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex space-x-2 border-t border-gray-700 pt-3">
                        <button
                          onClick={() => handleEdit(trade)}
                          className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => trade._id && handleDelete(trade._id)}
                          className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition duration-200"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}