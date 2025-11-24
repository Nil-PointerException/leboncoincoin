import { Divider, Box } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledDivider = styled(Divider)(({ theme }) => ({
  borderColor: 'rgba(0, 0, 0, 0.08)',
  '&::before, &::after': {
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
}))

const DuckIcon = styled('span')(({ theme }) => ({
  display: 'inline-block',
  fontSize: '1.5rem',
  animation: 'float 3s ease-in-out infinite',
  '@keyframes float': {
    '0%, 100%': {
      transform: 'translateY(0px)',
    },
    '50%': {
      transform: 'translateY(-5px)',
    },
  },
}))

export const DuckDivider = () => {
  return (
    <StyledDivider>
      <DuckIcon>🦆</DuckIcon>
    </StyledDivider>
  )
}

export const SimpleDuckDivider = () => {
  return <StyledDivider sx={{ my: 3 }} />
}


