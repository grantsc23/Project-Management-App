import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { ReactComponent as UserLogo } from './../svg/user.svg';


const AppNavBar: React.FC = () => {
    // TODO: remove hard coding:
    const displayName = '--DISPLAY NAME--';
    return (
        <Navbar bg="dark">
            <Nav className="mr-auto">
            </Nav>
            <Nav>
                <Nav.Item>
                    <UserLogo className="mr-2" />
                    <span className="text-light lead">{displayName}</span>
                </Nav.Item>
            </Nav>
        </Navbar>
    )
}

export default AppNavBar;