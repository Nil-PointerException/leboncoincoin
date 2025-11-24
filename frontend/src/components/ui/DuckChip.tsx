import { Chip, ChipProps } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  borderRadius: 8,
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.12)',
  },
  '&.MuiChip-colorPrimary': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  '&.MuiChip-colorSecondary': {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },
}))

export const DuckChip = (props: ChipProps) => {
  return <StyledChip {...props} />
}

// Variants de catégories avec couleurs
export const CategoryChip = ({ label, ...props }: ChipProps) => (
  <DuckChip
    label={label}
    size="small"
    {...props}
  />
)

export const PriceChip = ({ label, ...props }: ChipProps) => (
  <DuckChip
    label={label}
    color="secondary"
    size="small"
    {...props}
  />
)

export const LocationChip = ({ label, ...props }: ChipProps) => (
  <DuckChip
    label={label}
    variant="outlined"
    size="small"
    {...props}
  />
)


