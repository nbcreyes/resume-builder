import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";

const NavLink = ({ to, children, onClick }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`text-sm font-medium transition-colors duration-200 px-3 py-2 rounded-lg ${
        active
          ? "text-primary bg-primary/10"
          : "text-tx-secondary hover:text-tx-primary hover:bg-surface-2"
      }`}
    >
      {children}
    </Link>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-surface font-display font-bold text-sm">R</span>
          </div>
          <span className="font-display font-bold text-tx-primary text-lg">ResumeAI</span>
        </Link>

        {user && (
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/cover-letter">Cover Letter</NavLink>
            <NavLink to="/ats">ATS Checker</NavLink>
            <NavLink to="/job-match">Job Match</NavLink>
            <NavLink to="/interview-prep">Interview Prep</NavLink>
          </div>
        )}

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-xs text-tx-secondary border border-bdr rounded-lg px-3 py-2">
                {user.name}
              </span>
              <Button variant="ghost" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-tx-secondary hover:text-tx-primary"
          onClick={() => setOpen(!open)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden mt-4 flex flex-col gap-1 border-t border-bdr pt-4">
          {user ? (
            <>
              <NavLink to="/dashboard" onClick={() => setOpen(false)}>Dashboard</NavLink>
              <NavLink to="/cover-letter" onClick={() => setOpen(false)}>Cover Letter</NavLink>
              <NavLink to="/ats" onClick={() => setOpen(false)}>ATS Checker</NavLink>
              <NavLink to="/job-match" onClick={() => setOpen(false)}>Job Match</NavLink>
              <NavLink to="/interview-prep" onClick={() => setOpen(false)}>Interview Prep</NavLink>
              <button
                onClick={logout}
                className="text-sm text-left text-red-400 px-3 py-2 hover:bg-surface-2 rounded-lg mt-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={() => setOpen(false)}>Login</NavLink>
              <NavLink to="/register" onClick={() => setOpen(false)}>Get Started</NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;