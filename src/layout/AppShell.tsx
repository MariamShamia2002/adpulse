import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { Activity } from 'lucide-react'

import { cn } from '@/lib/utils'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors duration-150 ease-out',
    isActive
      ? 'bg-surface-muted text-text'
      : 'text-text-secondary hover:text-text',
  )

export default function AppShell() {
  const location = useLocation()
  const onCampaignDetail = location.pathname.startsWith('/campaigns/')

  return (
    <div className="min-h-svh bg-page text-text">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-14 max-w-[1360px] items-center gap-6 px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.01em] text-text"
          >
            <Activity className="size-5 text-series-1" aria-hidden />
            AdPulse
          </Link>

          <nav
            aria-label="Primary"
            className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto"
          >
            <NavLink to="/" end className={navLinkClass}>
              Overview
            </NavLink>
            {/* Campaigns table lives on Overview; detail routes are /campaigns/:id */}
            <Link
              to="/"
              className={navLinkClass({ isActive: onCampaignDetail })}
              aria-current={onCampaignDetail ? 'page' : undefined}
            >
              Campaigns
            </Link>
            <a
              href="#settings"
              className="rounded-full px-3 py-1.5 text-[13px] font-medium text-text-secondary hover:text-text"
            >
              Settings
            </a>
          </nav>

          <div
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-muted text-[12px] font-semibold text-text-secondary"
            aria-hidden
          >
            AP
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1360px] px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}
