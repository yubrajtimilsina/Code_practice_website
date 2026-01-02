import React from 'react';
import { Search, Filter, ChevronDown, X } from "lucide-react";

export function FilterPanel({
  searchValue,
  onSearchChange,
  filters = [],
  onFilterChange,
  showFilters,
  onToggleFilters,
  activeFilters = {},
  onClearFilters,
  children,
  className = ""
}) {
  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  return (
    <div className={className}>
      {/* Filter Toggle Header */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <button
          onClick={onToggleFilters}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors"
        >
          <Filter className="w-5 h-5" />
          Filters
          <ChevronDown 
            className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} 
          />
        </button>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors text-sm font-medium"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            {onSearchChange && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Dynamic Filters */}
            {filters.map((filter) => (
              <div key={filter.name}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {filter.label}
                </label>
                <select
                  value={filter.value}
                  onChange={(e) => onFilterChange(filter.name, e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Additional Content (Quick buttons, etc) */}
          {children && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              {children}
            </div>
          )}
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-blue-900">Active Filters:</span>
            {Object.entries(activeFilters).map(([key, value]) => (
              <span 
                key={key}
                className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-medium"
              >
                {key}: {value}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterPanel;