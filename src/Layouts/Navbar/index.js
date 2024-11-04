import { useContext, useState } from "react";
import {
  Collapse,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarText,
  NavbarToggler,
  NavItem,
} from "reactstrap";
import { NavLink } from "react-router-dom";
import logo from "../../Assests/Images/logo_mini.png";
import { AuthContext } from "../../Services/Contexts/AuthContext";
import AdminNavDropdown from "./AdminNavDropdown";

const Header = () => {
  const { authState, connectWallet, logout } = useContext(AuthContext);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const isAuthenticated = authState.isAuthenticated;
  const role = authState.stakeholder.role;

  const style = {
    authButton: {
      fontWeight: "bolder",
      color: "#fff",
    },
    authText: {
      color: "#fff",
    },
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const roleNavLinks = () => {
    switch (role) {
      case "admin":
        return (
          <>
            <AdminNavDropdown />
          </>
        );
      case "manufacturer":
        return (
          <>
            {authState.stakeholder.isVerified ? (
              <>
                <NavItem>
                  <NavLink
                    to={`/manufacturers/register-drum/${authState.stakeholder.id}`}
                    className="nav-link"
                  >
                    Register Drum
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    to={`/manufacturers/manage-alerts/${authState.stakeholder.id}`}
                    className="nav-link"
                  >
                    Manage Alerts
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    to={`/manufacturers/me/${authState.stakeholder.id}`}
                    className="nav-link"
                  >
                    Profile
                  </NavLink>
                </NavItem>
              </>
            ) : (
              <>
                <NavItem>
                  <NavLink
                    to={`/manufacturers/me/${authState.stakeholder.id}`}
                    className="nav-link"
                  >
                    Profile
                  </NavLink>
                </NavItem>
              </>
            )}
          </>
        );
      case "temporary-storage-facility":
        return (
          <>
            <NavItem>
              <NavLink
                to={`/storage-facilities/manage-alerts/${authState.stakeholder.id}`}
                className="nav-link"
              >
                Manage Alerts
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                to={`/storage-facilities/${authState.stakeholder.id}`}
                className="nav-link"
              >
                Profile
              </NavLink>
            </NavItem>
          </>
        );
      case "long-storage-facility":
        return (
          <>
            <NavItem>
              <NavLink
                to={`/storage-facilities/manage-alerts/${authState.stakeholder.id}`}
                className="nav-link"
              >
                Manage Alerts
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                to={`/storage-facilities/${authState.stakeholder.id}`}
                className="nav-link"
              >
                Profile
              </NavLink>
            </NavItem>
          </>
        );
      case "new":
        return (
          <>
            <NavItem>
              <NavLink to="register" className="nav-link">
                Register
              </NavLink>
            </NavItem>
          </>
        );
      default:
        return (
          <>
            <NavItem>
              <NavLink to="profile" className="nav-link">
                Profile
              </NavLink>
            </NavItem>
          </>
        );
    }
  };

  return (
    <div className="container">
      <Navbar color="warning" expand="md" dark>
        <NavbarBrand>
          <img src={logo} alt="Logo" />
          Nuclear Waste Management
        </NavbarBrand>
        <NavbarToggler onClick={toggleNav}>
          {isNavOpen ? (
            <i className="fa fa-times"></i>
          ) : (
            <i className="fa fa-bars"></i>
          )}
        </NavbarToggler>
        <Collapse navbar isOpen={isNavOpen}>
          <Nav className="mx-auto" navbar>
            {isAuthenticated ? (
              <>
                {role === "admin" ? null : (
                  <NavItem>
                    <NavLink className="nav-link" to="/">
                      Dashboard
                    </NavLink>
                  </NavItem>
                )}

                {[
                  "admin",
                  "temporary-storage-facility",
                  "long-storage-facility",
                  "manufacturer",
                  "general-public",
                ].includes(role) && (
                  <NavItem>
                    <NavLink className="nav-link" to="/products">
                      All Drums
                    </NavLink>
                  </NavItem>               
                )}

                {roleNavLinks()}
              </>
            ) : (
              ""
            )}
          </Nav>
          <Nav className="ms-auto" navbar>
            {isAuthenticated ? (
              <>
                <NavbarText style={style.authText}>
                  {authState.formattedAddress} &nbsp;
                </NavbarText>
                <NavItem>
                  <NavbarText
                    type="button"
                    onClick={logout}
                    style={style.authButton}
                  >
                    <i className="fa fa-sign-out fa-lg" />
                    Logout
                  </NavbarText>
                </NavItem>
              </>
            ) : (
              <>
                <NavItem>
                  <NavbarText
                    type="button"
                    onClick={connectWallet}
                    style={style.authButton}
                  >
                    <i className="fa fa-sign-in fa-lg" /> Login
                  </NavbarText>
                </NavItem>
              </>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};
export default Header;
