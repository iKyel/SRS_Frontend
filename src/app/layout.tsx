import type { Metadata } from "next";
import "./globals.css";
import { Book, ShoppingCart } from "lucide-react";

export const metadata: Metadata = {
  title: "Book Management Dashboard",
  description: "Comprehensive book sales management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-gray-100">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white shadow-md">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-blue-600 flex items-center">
              <Book className="mr-2" /> BookHub
            </h1>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <a href="/" className="flex items-center p-2 hover:bg-blue-50 rounded-lg group">
                  <Book className="mr-3 text-gray-500 group-hover:text-blue-600" />
                  <span className="text-gray-700 group-hover:text-blue-600">Books</span>
                </a>
              </li>
              <li>
                <a href="/Order" className="flex items-center p-2 hover:bg-blue-50 rounded-lg group">
                  <ShoppingCart className="mr-3 text-gray-500 group-hover:text-blue-600" />
                  <span className="text-gray-700 group-hover:text-blue-600">Order</span>
                </a>
              </li>

              <li>
                <a href="/Nhanban" className="flex items-center p-2 hover:bg-blue-50 rounded-lg group">
                  <Book className="mr-3 text-gray-500 group-hover:text-blue-600" />
                  <span className="text-gray-700 group-hover:text-blue-600">Copies</span>
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="bg-white shadow-sm p-4 flex justify-between items-center">
            <div className="flex items-center">
              <input 
                type="text" 
                placeholder="Search books, sales, customers..." 
                className="w-96 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="text-gray-600 hover:text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </div>
              
            </div>
          </header>

          {/* Main Content */}
          <main className="p-6 bg-gray-100 flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-white shadow-md p-4 text-center">
            <p className="text-gray-600">
              © 2024 BookHub Dashboard. All rights reserved.
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}