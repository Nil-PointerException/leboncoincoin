import { Avatar, AvatarProps } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  fontWeight: 700,
  border: '3px solid #FFFFFF',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1) rotate(5deg)',
    boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',
  },
}))

export const DuckAvatar = (props: AvatarProps) => {
  return <StyledAvatar {...props} />
}


