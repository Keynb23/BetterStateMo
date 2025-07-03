// ProfileSortButton.jsx
import { useState } from 'react';
import { ChevronDown, ArrowDownWideNarrow, ArrowUpWideNarrow } from 'lucide-react';
import './ProfileStyles.css';

const sortOptions = [
  { label: 'Default', value: 'default' },
  { label: 'First Name (A-Z)', value: 'firstNameAsc' },
  { label: 'First Name (Z-A)', value: 'firstNameDesc' },
  { label: 'Last Name (A-Z)', value: 'lastNameAsc' },
  { label: 'Last Name (Z-A)', value: 'lastNameDesc' },
  { label: 'Date Created (Newest)', value: 'createdAtDesc' },
  { label: 'Date Created (Oldest)', value: 'createdAtAsc' },
];

const ProfileSortButton = ({ onSortChange, currentSort }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value) => {
    onSortChange(value);
    setIsOpen(false);
  };

  const getSortIcon = () => {
    if (currentSort.includes('Asc')) {
      return <ArrowUpWideNarrow className="Pro-Sort-btn__icon" />;
    }
    if (currentSort.includes('Desc')) {
      return <ArrowDownWideNarrow className="Pro-Sort-btn__icon" />;
    }
    return <ChevronDown className="Pro-Sort-btn__icon" />;
  };

  const currentLabel = sortOptions.find(option => option.value === currentSort)?.label || 'Sort By';

  return (
    <div className="Pro-Sort-dropdown">
      <div>
        <button
          type="button"
          className="Pro-Sort-btn"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          {currentLabel}
          {getSortIcon()}
        </button>
      </div>

      {isOpen && (
        <div
          className="Pro-Sort-dropdown__menu"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="Pro-Sort-dropdown__options" role="none">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`Pro-Sort-dropdown__item ${option.value === currentSort ? 'Pro-Sort-dropdown__item--active' : ''}`}
                role="menuitem"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSortButton;