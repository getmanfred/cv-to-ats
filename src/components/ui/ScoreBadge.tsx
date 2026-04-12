interface ScoreBadgeProps {
  score: number
  size?: 'sm' | 'lg'
}

function getScoreColor(score: number) {
  if (score >= 75) return { bg: 'bg-emerald-100', text: 'text-emerald-800' }
  if (score >= 50) return { bg: 'bg-amber-100', text: 'text-amber-800' }
  return { bg: 'bg-red-100', text: 'text-red-800' }
}

export default function ScoreBadge({ score, size = 'sm' }: ScoreBadgeProps) {
  const { bg, text } = getScoreColor(score)
  const sizeClass = size === 'lg' ? 'text-lg px-4 py-1.5' : 'text-sm px-3 py-1'

  return (
    <span
      className={[
        'inline-block rounded-full font-sans font-[900]',
        bg, text, sizeClass,
      ].join(' ')}
    >
      {score}/100
    </span>
  )
}
