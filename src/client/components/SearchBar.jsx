// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";

import { FaSearch } from "react-icons/fa";
import "../client/styles/search.css";
// eslint-disable-next-line no-unused-vars
import Anggota from "./Anggota";

export const SearchBar = (setInput) => {
  // Anda perlu mendefinisikan atau mengimpor anggotaData
  // eslint-disable-next-line no-unused-vars
  const [searchTerm, setSearchTerm] = useState(""); // State untuk menyimpan kata kunci pencarian

  // eslint-disable-next-line no-unused-vars
  const handleSearch = (value) => {
    setSearchTerm(value); // Simpan kata kunci pencarian dalam state
  };

  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input
        placeholder="Type to Search..."
        onChange={(e) => setInput(e.target.value)}
      />
    </div>
  );
};
