// src/components/Profile/ProfileSortButton.jsx
import { useState } from 'react';
import { ChevronDown, ArrowDownWideNarrow, ArrowUpWideNarrow } from 'lucide-react';
import './ProfileStyles.css'; // Ensure this path is correct

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
            return <ArrowUpWideNarrow className="icon" />; // Changed class name
        }
        if (currentSort.includes('Desc')) {
            return <ArrowDownWideNarrow className="icon" />; // Changed class name
        }
        return <ChevronDown className="icon" />; // Changed class name
    };

    const currentLabel = sortOptions.find(option => option.value === currentSort)?.label || 'Sort By';

    return (
        <div className="sort-dropdown"> {/* Changed class name */}
            <div>
                <button
                    type="button"
                    className="action-button sort-button" // Changed class name
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
                    className="dropdown-menu" // Changed class name
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                >
                    <div className="dropdown-options" role="none"> {/* Changed class name */}
                        {sortOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className={`dropdown-item ${option.value === currentSort ? 'active' : ''}`} // Changed class name
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