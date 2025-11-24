import { Button, ButtonProps } from '@mui/material'
import { styled } from '@mui/material/styles'

// 🦆 Bouton avec animation de canard
const StyledDuckButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 0,
    height: 0,
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.3)',
    transform: 'translate(-50%, -50%)',
    transition: 'width 0.6s, height 0.6s',
  },
  '&:hover::before': {
    width: '300px',
    height: '300px',
  },
  '&:active': {
    transform: 'scale(0.96)',
  },
}))

export const DuckButton = (props: ButtonProps) => {
  return <StyledDuckButton {...props} />
}

// Variants pré-configurés
export const PrimaryDuckButton = (props: ButtonProps) => (
  <DuckButton variant="contained" color="primary" {...props} />
)

export const SecondaryDuckButton = (props: ButtonProps) => (
  <DuckButton variant="contained" color="secondary" {...props} />
)

export const OutlinedDuckButton = (props: ButtonProps) => (
  <DuckButton variant="outlined" color="primary" {...props} />
)


