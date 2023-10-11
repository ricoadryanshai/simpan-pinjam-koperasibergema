// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";

function Header() {
  const [activePage, setActivePage] = useState("nasabah");

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  return (
    <header>
      <nav>
        <ul>
          <li className={activePage === "nasabah" ? "active" : ""}>
            <button onClick={() => handlePageChange("nasabah")}>Nasabah</button>
          </li>
          <li className={activePage === "pinjaman" ? "active" : ""}>
            <button onClick={() => handlePageChange("pinjaman")}>
              Pinjaman
            </button>
          </li>
          <li className={activePage === "simpanan" ? "active" : ""}>
            <button onClick={() => handlePageChange("simpanan")}>
              Simpanan
            </button>
          </li>
          <li className={activePage === "laporan" ? "active" : ""}>
            <button onClick={() => handlePageChange("laporan")}>Laporan</button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
