"use client";
import React from "react";
import Navbar from '@/components/navbar';

const NewsPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900">
            <Navbar />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center mb-6">
                            <div className="bg-blue-600 p-3 rounded-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h1 className="text-3xl font-bold text-white">Kalender Ekonomi</h1>
                                <p className="text-gray-400 mt-2">Pantau berita dan event ekonomi terkini</p>
                            </div>
                        </div>
                    </div>

                    {/* Calendar Container */}
                    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Investing.com Economic Calendar</h2>
                            <span className="text-sm text-gray-400">Data Real-time</span>
                        </div>

                        <div className="bg-gray-750 rounded-lg p-4">
                            <div className="overflow-hidden rounded-lg border border-gray-700">
                                <iframe
                                    title="Investing.com Economic Calendar"
                                    src="https://sslecal2.investing.com?ecoDayBackground=%231f2937&innerBorderColor=%23374151&borderColor=%23374151&defaultColor=%236b7280&currentColor=%230ea5e9&negativeColor=%23ef4444&positiveColor=%2322c55e&textColor=%23f3f4f6&columns=exc_flags,time,impact,previous,forecast,actual&importanceFilter=3,2,1&features=datepicker,timezone,filters&countries=25,32,4,5,72,6,17,10,37,43,35,22,12,26,11,14,48,33,36,39,56,110,34,87,97,89,42,41,23,21,94,45,55,15,92,38,7,24,51,68,52,46,53,61,63,70,75,71,77,78,79,80,81,82,83,84,85,86,88,90,91,93,95,96,98,99,100,101,102,103,104,105,106,107,108,109,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140&calType=week&timeZone=64&lang=1"
                                    width="100%"
                                    height="800"
                                    frameBorder="0"
                                    scrolling="yes"
                                    loading="lazy"
                                    className="bg-transparent"
                                    style={{ minHeight: '600px' }}
                                />
                            </div>
                        </div>

                        {/* Info Footer */}
                        <div className="mt-6 pt-4 border-t border-gray-700">
                            <div className="flex justify-between items-center text-sm text-gray-500">
                                <span>Data disediakan oleh Investing.com</span>
                                <span>Update Real-time</span>
                            </div>
                        </div>
                    </div>

                    {/* Additional Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        {/* Info Card 1 */}
                        <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:bg-gray-750 transition duration-200">
                            <div className="flex items-center mb-4">
                                <div className="bg-green-500 p-2 rounded-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <h3 className="ml-3 text-lg font-semibold text-white">Dampak Ekonomi Tinggi</h3>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Pantau peristiwa ekonomi berdampak besar yang dapat secara signifikan menggerakkan pasar.
                            </p>
                        </div>

                        {/* Info Card 2 */}
                        <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:bg-gray-750 transition duration-200">
                            <div className="flex items-center mb-4">
                                <div className="bg-yellow-500 p-2 rounded-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="ml-3 text-lg font-semibold text-white">Pembaruan Waktu Nyata</h3>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Get real-time economic data and news updates as they are released.
                            </p>
                        </div>

                        {/* Info Card 3 */}
                        <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:bg-gray-750 transition duration-200">
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-500 p-2 rounded-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                    </svg>
                                </div>
                                <h3 className="ml-3 text-lg font-semibold text-white">Cakupan Global</h3>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Liputan menyeluruh terhadap peristiwa ekonomi dari berbagai negara utama di seluruh dunia.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsPage;