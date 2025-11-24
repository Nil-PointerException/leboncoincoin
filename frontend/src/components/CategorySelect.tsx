import {
  TextField,
  MenuItem,
  Box,
  Typography,
} from '@mui/material'
import { CATEGORIES } from '@/constants/categories'
import { getCategoryIcon } from '@/constants/categoryIcons'
import type { Category } from '@/constants/categories'

interface CategorySelectProps {
  value: string
  onChange: (category: string | undefined) => void
  label?: string
  required?: boolean
  fullWidth?: boolean
  helperText?: string
  variant?: 'standard' | 'outlined' | 'filled'
  size?: 'small' | 'medium'
  sx?: any
  disableUnderline?: boolean
  hideLabel?: boolean
  customRenderValue?: (value: string) => React.ReactNode
}

export default function CategorySelect({
  value,
  onChange,
  label = 'Catégorie',
  required = false,
  fullWidth = true,
  helperText,
  variant = 'outlined',
  size = 'medium',
  sx,
  disableUnderline = false,
  hideLabel = false,
  customRenderValue,
}: CategorySelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue || undefined)
  }

  const IconComponent = getCategoryIcon(value as Category)

  const defaultRenderValue = (selected: any) => {
    if (!selected) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
          <IconComponent fontSize="small" />
          <span>Toutes catégories</span>
        </Box>
      )
    }
    const CategoryIcon = getCategoryIcon(selected as Category)
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CategoryIcon fontSize="small" color="primary" />
        <Typography component="span" fontWeight={500}>
          {selected}
        </Typography>
      </Box>
    )
  }

  // Always shrink label when using custom renderValue to prevent overlap
  // For outlined/filled variants, label should always be at top when renderValue is used
  const shouldShrinkLabel = variant === 'outlined' || variant === 'filled'

  return (
    <TextField
      fullWidth={fullWidth}
      select
      required={required}
      label={hideLabel ? undefined : label}
      value={value || ''}
      onChange={handleChange}
      variant={variant}
      size={size}
      helperText={helperText}
      InputLabelProps={!hideLabel ? {
        shrink: shouldShrinkLabel ? true : undefined,
      } : undefined}
      SelectProps={{
        displayEmpty: true,
        disableUnderline: disableUnderline,
        renderValue: customRenderValue || defaultRenderValue,
      }}
      sx={sx}
    >
      <MenuItem value="">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconComponent fontSize="small" sx={{ color: 'text.secondary' }} />
          <em>Toutes catégories</em>
        </Box>
      </MenuItem>
      {CATEGORIES.map((category) => {
        const CategoryIcon = getCategoryIcon(category)
        return (
          <MenuItem key={category} value={category}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CategoryIcon fontSize="small" color="primary" />
              <Typography fontWeight={value === category ? 600 : 400}>
                {category}
              </Typography>
            </Box>
          </MenuItem>
        )
      })}
    </TextField>
  )
}

