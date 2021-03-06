import React, { useState } from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { Link } from "gatsby";

import getIcon from "../utilities/getIcon";

import "./header.scss";

const modalStyles = {
  content: {
    top: "0",
    left: "0",
    bottom: "auto",
    width: "100vw",
  },
};

const buildNavlinks = (navigationData, linkWrapperClasses, linkClasses) => {
  const navLinks = [];

  navigationData.forEach((link) => {
    const { title, href } = link;
    const linkKey = `nav-list-item-${title}`;
    navLinks.push(
      <li key={linkKey} className={linkWrapperClasses}>
        <Link to={href} className={linkClasses}>{title}</Link>
      </li>
    );
  });

  return navLinks;
};

const buildSiteLogo = (siteTitle) => {
  const BrandLogo = getIcon("brand-logo");

  return (
    <Link to="/" className="text-inherit flex flex-row items-center">
      <span className="sr-only">Go to home:</span>
      <BrandLogo className="h-32 mr-10" />
      <h1 className="font-normal">{siteTitle}</h1>
    </Link>
  );
};

const MobileNav = ({ siteLogo, navigationData, isScrolled }) => {
  const [modalIsOpen, setModalState] = React.useState(false);

  const toggleModal = (state) => {
    setModalState(state);
  };

  const hamburgerClasses = `hamburger md:hidden w-40 p-0 cursor-pointer bg-transparent border-none ${modalIsOpen ? "active" : ""}`;
  const hamburgerLineClasses = `w-full h-4 block transition-500 bg-${isScrolled || modalIsOpen ? "charcoal" : "white"}`;
  const navLinkClasses = "text-18 text-inherit uppercase font-medium transition-500 pb-4";
  const linkWrapperClasses = "py-12";
  const links = buildNavlinks(navigationData, linkWrapperClasses, navLinkClasses);

  return (
    <>
      <button
        type="button"
        className={hamburgerClasses}
        onClick={() => { toggleModal(!modalIsOpen); }}
      >
        <span className="sr-only">Open mobile nav</span>
        <div className="w-full h-28 flex flex-col justify-between">
          <span className={hamburgerLineClasses} />
          <span className={hamburgerLineClasses} />
          <span className={hamburgerLineClasses} />
        </div>
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => { toggleModal(false); }}
        closeTimeoutMS={500}
        style={modalStyles}
      >
        <div className="w-full flex justify-between text-charcoal">
          {siteLogo}
          <button
            type="button"
            className="close-x w-40 p-0 cursor-pointer bg-transparent border-none"
            onClick={() => { toggleModal(false); }}
          >
            <span className="sr-only">Close mobile nav</span>
            <div className="w-full h-30 flex flex-col justify-between">
              <span className="w-full h-4 block bg-charcoal rotate-45" />
              <span className="w-full h-4 block bg-charcoal -rotate-45" />
            </div>
          </button>
        </div>
        <nav className="my-16">
          <ul className="flex flex-col text-charcoal">
            {links}
          </ul>
        </nav>
      </Modal>
    </>
  );
};

const Header = ({ siteTitle, navigationData }) => {
  const [headerStyle, setHeaderStyle] = useState({
    transition: "all 500ms linear",
    color: "#f7f7f7",
  });

  const [isScrolled, setScrolled] = useState(false);

  useScrollPosition(
    (position) => {
      const { currPos } = position;
      const isTransparent = currPos.y > -1;

      const shouldBeStyle = {
        transition: "all 500ms linear",
        color: isTransparent ? "#f7f7f7" : "#544C4A", // off-white / charcoal
        backgroundColor: isTransparent ? "transparent" : "white",
        boxShadow: isTransparent ? "none" : "0px 0px 15px -5px rgba(0,0,0,0.25)",
      };

      if (JSON.stringify(shouldBeStyle) === JSON.stringify(headerStyle)) return;

      setHeaderStyle(shouldBeStyle);
      setScrolled(!isScrolled);
    }
  );

  const navLinkClasses = "px-8 py-2 text-inherit uppercase font-medium";
  const linkWrapperClasses = "pl-28";
  const siteLogo = buildSiteLogo(siteTitle);
  const links = buildNavlinks(navigationData, linkWrapperClasses, navLinkClasses);

  return (
    <header
      className="navbar w-full max-w-1600 h-80 flex flex-row justify-between items-center fixed -top-1 z-1"
      style={{ ...headerStyle }}
    >
      {siteLogo}
      <nav className="hidden md:block">
        <ul className="flex flex-row">
          {links}
        </ul>
      </nav>
      <MobileNav siteLogo={siteLogo} navigationData={navigationData} isScrolled={isScrolled} />
    </header>
  );
};

export default Header;

Header.propTypes = {
  siteTitle: PropTypes.string,
  navigationData: PropTypes.arrayOf(PropTypes.object),
};

Header.defaultProps = {
  siteTitle: "",
  navigationData: [],
};

MobileNav.propTypes = {
  siteLogo: PropTypes.node,
  navigationData: PropTypes.arrayOf(PropTypes.object),
  isScrolled: PropTypes.bool.isRequired,
};

MobileNav.defaultProps = {
  siteLogo: "",
  navigationData: [],
};
