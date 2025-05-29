import React from 'react';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ query, handleInputChange, handleSearch }) => {
  return (
    <div style={{ display: 'flex', width: '500px', justifyContent: 'center', alignItems: 'center', }}>

      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search"
        style={{
          padding: '10px',
          borderTopLeftRadius: '80px 80px',
          borderBottomLeftRadius: '80px 80px',
          border: '1px solid #ccc',
          height: '20px',
          width: '100%', // Set width to 100% of its container
          fontSize: '16px',
          outline: 'none',
        }}

        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            console.log('Enter key pressed');
            handleSearch();
          }
        }}

        // CSS for when input is focused
        onFocus={(e) => {
          e.target.style.border = '1px solid #007bff';
          e.target.style.color = '#000000';
          e.target.style.backgroundColor = '#fafafa';
        }}

        // Reset styles on blur
        onBlur={(e) => {
          e.target.style.border = '1px solid #ccc';
          e.target.style.color = '#000000';
          e.target.style.backgroundColor = '#fafafa';
        }}

      />

      <div onClick={() => {
        console.log('Search button clicked');
        handleSearch()
      }}
        style={{
          width: '35px',
          textAlign: 'center',
          backgroundColor: '#FaFaFa',
          padding: '10px',
          border: '1px solid #ccc',
          borderTopRightRadius: '80px 80px',
          borderBottomRightRadius: '80px 80px',
          marginRight: '0',
          height: '20px',
          cursor: 'pointer' // Add this line
        }} >
        <SearchIcon style={{ fontSize: '20px' }} />
      </div>
    </div>
  );
}

export default SearchBar;
