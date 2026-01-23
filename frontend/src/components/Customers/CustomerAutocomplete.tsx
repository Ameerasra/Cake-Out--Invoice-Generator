import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Customer } from '../../types';
import { customerApi } from '../../services/api/customers';
import './CustomerAutocomplete.css';

interface CustomerAutocompleteProps {
  value: Customer | null;
  onChange: (customer: Customer | null) => void;
  onInputChange?: (value: string) => void;
  inputValue?: string;
  required?: boolean;
}

const CustomerAutocomplete: React.FC<CustomerAutocompleteProps> = ({
  value,
  onChange,
  onInputChange,
  inputValue,
  required = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Customer[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync internal search term with external inputValue if provided
  useEffect(() => {
    if (inputValue !== undefined && inputValue !== searchTerm) {
      setSearchTerm(inputValue);
    }
  }, [inputValue, searchTerm]);

  // Debounced search
  const debouncedSearch = useCallback((term: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      // Only search if term is long enough and we don't have a direct match selected yet?
      // Actually always search to show options if user is typing
      if (term.trim().length >= 2) {
        setIsLoading(true);
        setError(null);
        try {
          const results = await customerApi.search(term);
          setSuggestions(results);
          setIsOpen(true);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to search customers');
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 300);
  }, []);

  useEffect(() => {
    // If searchTerm changes and it does NOT match the currently selected value's name, trigger search
    if (searchTerm && (!value || searchTerm !== value.name)) {
      debouncedSearch(searchTerm);
    } else if (!searchTerm) {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [searchTerm, value, debouncedSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    // Notify parent of text change
    if (onInputChange) {
      onInputChange(term);
    }

    // If typing creates a mismatch with selected value, clear selected value
    if (value && term !== value.name) {
      onChange(null);
    }
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSearchTerm(customer.name);
    onChange(customer);
    setIsOpen(false);
    setSuggestions([]);

    // Also update parent input value
    if (onInputChange) {
      onInputChange(customer.name);
    }
  };

  const handleInputFocus = () => {
    if (searchTerm.trim().length >= 2 && suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && suggestions.length > 0 && isOpen) {
      e.preventDefault(); // Prevent form submission
      handleSelectCustomer(suggestions[0]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="customer-autocomplete" ref={wrapperRef}>
      <div className="customer-input-wrapper">
        <input
          type="text"
          className={`customer-input ${error ? 'error' : ''}`}
          placeholder="Search or enter new customer name"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
        // required={required} // Handled by parent
        />
        {isLoading && <span className="loading-spinner">⏳</span>}
      </div>

      {error && <div className="error-message">{error}</div>}

      {isOpen && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((customer) => (
            <li
              key={customer.id}
              className="suggestion-item"
              onClick={() => handleSelectCustomer(customer)}
            >
              <div className="suggestion-name">{customer.name}</div>
              {customer.phone && (
                <div className="suggestion-details">📞 {customer.phone}</div>
              )}
            </li>
          ))}
        </ul>
      )}

      {value && (
        <div className="selected-customer-info">
          <div><strong>ID:</strong> CUST-{value.id.toString().padStart(4, '0')}</div>
          {value.phone && <div><strong>Phone:</strong> {value.phone}</div>}
          {value.address && <div><strong>Address:</strong> {value.address}</div>}
        </div>
      )}
    </div>
  );
};

export default CustomerAutocomplete;

