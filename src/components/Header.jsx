// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import "../styles/header.css";

function Header() {
  const [activePage, setActivePage] = useState("nasabah");
  const [simpananDropdown, setSimpananDropdown] = useState(false);

  const handlePageChange = (page) => {
    setActivePage(page);
    setSimpananDropdown(false);
  };

  const toggleSimpananDropdown = () => {
    setSimpananDropdown(!simpananDropdown);
  };

  return (
    <header className="nav-header">
      <div className="logo">
        <img src="/koperasi-indonesia.svg" alt="Logo Koperasi Indonesia" />
      </div>
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
            <div className="dropdown">
              <button onClick={toggleSimpananDropdown}>Simpanan</button>
              {simpananDropdown && (
                <ul className="dropdown-content">
                  <li className={activePage === "setor-tunai" ? "active" : ""}>
                    <button onClick={() => handlePageChange("setor-tunai")}>
                      Setor Tunai
                    </button>
                  </li>
                  <li
                    className={activePage === "penarikan-tunai" ? "active" : ""}
                  >
                    <button onClick={() => handlePageChange("penarikan-tunai")}>
                      Penarikan Tunai
                    </button>
                  </li>
                </ul>
              )}
            </div>
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
