import { Card, CardProps } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ReactNode } from 'react'

interface DuckCardProps extends CardProps {
  hover?: boolean
  gradient?: boolean
  children: ReactNode
}

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'hover' && prop !== 'gradient',
})<{ hover?: boolean; gradient?: boolean }>(({ theme, hover, gradient }) => ({
  position: 'relative',
  borderRadius: 16,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  ...(gradient && {
    background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFEF7 100%)',
  }),
  ...(hover && {
    '&:hover': {
      transform: 'translateY(-8px) scale(1.02)',
      boxShadow: '0px 12px 32px rgba(255, 215, 0, 0.2)',
      borderColor: theme.palette.primary.main,
    },
  }),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    borderRadius: '16px 16px 0 0',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  ...(hover && {
    '&:hover::before': {
      opacity: 1,
    },
  }),
}))

export const DuckCard = ({ hover = true, gradient = false, children, ...props }: DuckCardProps) => {
  return (
    <StyledCard hover={hover} gradient={gradient} {...props}>
      {children}
    </StyledCard>
  )
}


