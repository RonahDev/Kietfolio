import React, { useState } from 'react'
import { AdminAuthProvider, useAdminAuth } from '../context'
import { AdminSidebar, type AdminTab } from '../components/sidebar/AdminSidebar'
import { AdminNavbar } from '../components/navbar/AdminNavbar'
import { AdminLoginPage } from '../pages/AdminLoginPage'
import { AdminDashboardOverview } from '../pages/AdminDashboardOverview'
import { AdminMoviesPage } from '../pages/AdminMoviesPage'
import { AdminTVSeriesPage } from '../pages/AdminTVSeriesPage'
import { AdminTaxonomiesPage } from '../pages/AdminTaxonomiesPage'
import { AdminBannersPage } from '../pages/AdminBannersPage'
import { AdminUsersPage } from '../pages/AdminUsersPage'
import { AdminAnalyticsPage } from '../pages/AdminAnalyticsPage'
import { AdminSystemPage } from '../pages/AdminSystemPage'
import { AdminAuditLogsPage } from '../pages/AdminAuditLogsPage'
import { AdminSecurityPage } from '../pages/AdminSecurityPage'

interface AdminLayoutContentProps {
  onBackToCinema: () => void
}

const AdminLayoutContent: React.FC<AdminLayoutContentProps> = ({ onBackToCinema }) => {
  const { adminUser, isAuthenticated, isLoading, logout } = useAdminAuth()
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-full border-2 border-[#dc2626] border-t-transparent animate-spin mb-4" />
        <span className="text-xs font-mono text-[#a1a1aa] tracking-widest uppercase">
          Khởi tạo phiên quản trị Movie Hub...
        </span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLoginPage />
  }

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminDashboardOverview />
      case 'movies':
        return <AdminMoviesPage />
      case 'tv_series':
        return <AdminTVSeriesPage />
      case 'genres':
        return <AdminTaxonomiesPage initialTab="genres" />
      case 'categories':
        return <AdminTaxonomiesPage initialTab="categories" />
      case 'banners':
        return <AdminBannersPage />
      case 'auto_sync':
        return <AdminSystemPage initialSubTab="auto_sync" />
      case 'users':
      case 'rbac':
        return <AdminUsersPage />
      case 'analytics':
      case 'revenue':
      case 'reports':
        return <AdminAnalyticsPage />
      case 'video_servers':
        return <AdminSystemPage initialSubTab="video_servers" />
      case 'broken_links':
        return <AdminSystemPage initialSubTab="broken_links" />
      case 'settings':
        return <AdminSystemPage initialSubTab="settings" />
      case 'audit_logs':
        return <AdminAuditLogsPage />
      case 'security':
        return <AdminSecurityPage />
      default:
        return <AdminDashboardOverview />
    }
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col font-sans selection:bg-[#dc2626] selection:text-white">
      {/* Fixed Admin Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        onLogout={logout}
        role={adminUser?.role}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isCollapsed ? 'pl-20' : 'pl-72'
        }`}
      >
        {/* Sticky Top Navbar */}
        <AdminNavbar
          activeTab={activeTab}
          adminUser={adminUser}
          onBackToCinema={onBackToCinema}
        />

        {/* Dynamic Page Container */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          {renderActiveTabContent()}
        </main>
      </div>
    </div>
  )
}

export const AdminLayout: React.FC<{ onBackToCinema?: () => void }> = ({
  onBackToCinema = () => {
    window.location.hash = '#cinema'
    window.dispatchEvent(new CustomEvent('kietfolio:navigate-view', { detail: { view: 'cinema' } }))
  },
}) => {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent onBackToCinema={onBackToCinema} />
    </AdminAuthProvider>
  )
}
