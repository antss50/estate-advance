const Navbar = () => {
  return (
    <nav className="navbar" aria-label="Primary">
      <ul className="navbar-links">
        <li className="nav-item active">
          <a href="/">Trang Chủ</a>
        </li>
        {/* <li className="nav-item">
          <a href="/about">Giới thiệu</a>
        </li> */}
        <li className="nav-item">
          <a href="/kinh-nghiem-thue-nha">Kinh nghiệm</a>
        </li>
        <li className="nav-item">
          <a href="/contact">Liên hệ</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
