import { Badge, BadgeProps } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    fontWeight: 700,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    animation: 'pulse 2s infinite',
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
    },
    '50%': {
      transform: 'scale(1.1)',
    },
    '100%': {
      transform: 'scale(1)',
    },
  },
}))

export const DuckBadge = (props: BadgeProps) => {
  return <StyledBadge {...props} />
}


