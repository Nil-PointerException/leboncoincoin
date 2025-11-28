import { Card, CardProps } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ReactNode } from 'react'

interface DuckCardProps extends CardProps {
  hover?: boolean
  children: ReactNode
}

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'hover',
})<{ hover?: boolean }>(({ theme, hover }) => ({
  position: 'relative',
  borderRadius: 16,
  backgroundColor: '#FFFFFF',
  border: '1px solid #F3F4F6',
  boxShadow: '0 2px 4px rgba(15, 23, 42, 0.02)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
  ...(hover && {
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
      borderColor: theme.palette.primary.main,
    },
  }),
}))

export const DuckCard = ({ hover = true, children, ...props }: DuckCardProps) => {
  return (
    <StyledCard hover={hover} {...props}>
      {children}
    </StyledCard>
  )
}


