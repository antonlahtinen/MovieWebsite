import React, { useState, useEffect } from 'react';
import { Box, TextField, Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getGenres } from '../services/api';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [genres, setGenres] = useState([]);
    const [sortBy, setSortBy] = useState('titleAsc');

    // Generate years from 1888 to current year
    const years = Array.from(
        { length: new Date().getFullYear() - 1887 },
        (_, i) => new Date().getFullYear() - i
    );

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const genreList = await getGenres();
                setGenres(genreList);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };
        fetchGenres();
    }, []);

    const handleSearch = () => {
        onSearch({
            search: searchTerm,
            genre: selectedGenre,
            year: selectedYear,
            sortBy
        });
    };

    // Debounce search to avoid too many API calls
    useEffect(() => {
        const timeoutId = setTimeout(handleSearch, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, selectedGenre, selectedYear, sortBy]);

    return (
        <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            flexWrap: 'wrap',
            alignItems: 'center',
            mb: 3,
            p: 2,
            backgroundColor: 'background.paper',
            borderRadius: 1,
            boxShadow: 1
        }}>
            <TextField
                label="Search movies"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ flexGrow: 1, minWidth: '200px' }}
                InputProps={{
                    endAdornment: (
                        <IconButton onClick={handleSearch}>
                            <SearchIcon />
                        </IconButton>
                    ),
                }}
            />

            <FormControl sx={{ minWidth: '150px' }}>
                <InputLabel>Genre</InputLabel>
                <Select
                    value={selectedGenre}
                    label="Genre"
                    onChange={(e) => setSelectedGenre(e.target.value)}
                >
                    <MenuItem value="">All Genres</MenuItem>
                    {genres.map((genre) => (
                        <MenuItem key={genre} value={genre}>
                            {genre}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl sx={{ minWidth: '150px' }}>
                <InputLabel>Year</InputLabel>
                <Select
                    value={selectedYear}
                    label="Year"
                    onChange={(e) => setSelectedYear(e.target.value)}
                >
                    <MenuItem value="">All Years</MenuItem>
                    {years.map((year) => (
                        <MenuItem key={year} value={year}>
                            {year}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl sx={{ minWidth: '150px' }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <MenuItem value="titleAsc">Title (A-Z)</MenuItem>
                    <MenuItem value="titleDesc">Title (Z-A)</MenuItem>
                    <MenuItem value="yearDesc">Newest First</MenuItem>
                    <MenuItem value="yearAsc">Oldest First</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
};

export default SearchBar;
