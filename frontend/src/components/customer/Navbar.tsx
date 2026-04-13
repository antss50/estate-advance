const Navbar = () => {
  return (
    <nav className="navbar" aria-label="Primary">
      <ul className="navbar-links">
        <li className="nav-item active">
          <a href="/">Home</a>
        </li>
        <li className="nav-item">
          <a href="/about">About</a>
        </li>
        <li className="nav-item">
          <a href="/features">Features</a>
        </li>
        <li className="nav-item">
          <a href="/contact">Contact</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
