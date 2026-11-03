import { createBrowserRouter } from 'react-router'

import AppShell from '@/layout/AppShell'
import CampaignDetailPage from '@/features/campaigns/pages/CampaignDetailPage'
import OverviewPage from '@/features/overview/pages/OverviewPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <OverviewPage />,
      },
      {
        path: 'campaigns/:id',
        element: <CampaignDetailPage />,
      },
    ],
  },
])
