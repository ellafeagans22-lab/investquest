interface Props {
  size?: 'sm' | 'md' | 'lg'
  animate?: boolean
  className?: string
}

const SIZE_MAP = {
  sm: { src: '/buck-favicon.png', px: 64 },
  md: { src: '/buck-avatar.png', px: 168 },
  lg: { src: '/buck-avatar.png', px: undefined },
}

export default function Buck({ size = 'md', animate = true, className }: Props) {
  const { src, px } = SIZE_MAP[size]
  return (
    <img
      src={src}
      alt="Buck mascot"
      width={px}
      height={px}
      className={className}
      style={animate ? { animation: 'buck-bounce 2s ease-in-out infinite' } : undefined}
    />
  )
}
