import "../../styles/home.css";
function Footer() {
    return (
        <footer id="contact" className="home-footer">
            <div className="home-container home-footer-content">
                <div>
                    <h3>JobPortal</h3>
                    <p>Connecting talent with opportunity — faster, simpler, smarter.</p>
                </div>

                <div className="home-footer-links">
                    <a href="#home">Home</a>
                    <a href="#jobs">Jobs</a>
                    <a href="#roles">Roles</a>
                    <a href="#about">About</a>
                </div>

                <p className="home-footer-copy">© 2026 JobPortal. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
