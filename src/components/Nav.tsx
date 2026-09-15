import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Nav() {
  return (
    <nav className="bg-paper border-b border-rule px-6 py-3 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" />
        <span className="font-mono font-bold text-sm tracking-tight text-ink">
          HEMOGRID COMMAND INTERFACE
        </span>
      </div>
      <div className="flex items-center gap-6 text-xs font-mono">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? 'text-accent font-bold underline' : 'text-ink-mid hover:text-ink'
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/recommendations"
          className={({ isActive }) =>
            isActive ? 'text-accent font-bold underline' : 'text-ink-mid hover:text-ink'
          }
        >
          Recommendations
        </NavLink>
        <NavLink
          to="/network"
          className={({ isActive }) =>
            isActive ? 'text-accent font-bold underline' : 'text-ink-mid hover:text-ink'
          }
        >
          Network Graph
        </NavLink>
      </div>
    </nav>
  );
}
