import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={[
        'bg-white rounded-lg shadow-card border border-gray-light p-6',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}
