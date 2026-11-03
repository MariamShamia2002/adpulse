import { useParams } from 'react-router'

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold tracking-[-0.01em] text-text">
        Campaign detail
      </h1>
      <p className="text-[13px] text-text-secondary">
        Campaign <span className="font-medium text-text">{id}</span> will render
        here.
      </p>
    </div>
  )
}
