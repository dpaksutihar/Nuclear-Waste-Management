import { NavLink } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { useState } from 'react';

const AdminNavDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);

  return (
    <Dropdown nav isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle nav caret>
        Admin Actions
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem>
          <NavLink to="/admin/verify/manufacturer" className="nav-link" style={{ color: 'black' }}>
            Manufacturers
          </NavLink>
        </DropdownItem>
        <DropdownItem>
          <NavLink to="/admin/verify/storage-facilities" className="nav-link" style={{ color: 'black' }}>
            Storage Facilities
          </NavLink>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default AdminNavDropdown;
