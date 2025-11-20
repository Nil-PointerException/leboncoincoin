import { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  InputAdornment,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import type { ListingFilter } from '@/types'

interface ListingFiltersProps {
  onFilter: (filters: ListingFilter) => void
}

export default function ListingFilters({ onFilter }: ListingFiltersProps) {
  const [filters, setFilters] = useState<ListingFilter>({})

  const handleSearch = () => {
    onFilter(filters)
  }

  const handleReset = () => {
    setFilters({})
    onFilter({})
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder="Rechercher..."
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            placeholder="Catégorie"
            value={filters.category || ''}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            placeholder="Localisation"
            value={filters.location || ''}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          />
        </Grid>

        <Grid item xs={6} md={1.5}>
          <TextField
            fullWidth
            type="number"
            placeholder="Prix min"
            value={filters.minPrice || ''}
            onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
          />
        </Grid>

        <Grid item xs={6} md={1.5}>
          <TextField
            fullWidth
            type="number"
            placeholder="Prix max"
            value={filters.maxPrice || ''}
            onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
          />
        </Grid>

        <Grid item xs={12} md={1}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<FilterListIcon />}
              onClick={handleSearch}
            >
              Filtrer
            </Button>
            <Button onClick={handleReset} size="small">
              Reset
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  )
}

