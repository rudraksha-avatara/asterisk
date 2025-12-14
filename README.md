# IMDb Watch Tool

IMDb Watch Tool is a lightweight, client-side web utility that converts IMDb movie or series references into a redirect link for a configured streaming endpoint.

The tool accepts either a full IMDb URL or a direct IMDb ID, validates it, and redirects the user accordingly.
It does not host, stream, scrape, or store any media content.

This project is designed for simplicity, performance, and clarity.

---

## Key Features

* Accepts IMDb URLs and IMDb IDs
* Automatic IMDb ID extraction and validation
* Enter key and button submission support
* Clean, modern, responsive UI
* No backend or database required
* No cookies, tracking, or analytics
* Search engine indexing disabled

---

## How It Works

1. User enters an IMDb URL or IMDb ID.
2. The tool extracts the IMDb ID using pattern matching.
3. The ID is validated against the official IMDb format.
4. The browser redirects the user to the configured endpoint.

Example redirect format:

```
https://iiuo.org/?id=tt24060892
```

---

## Project Structure

```
/imdb/
├── index.html        # Main search page
├── style.css         # UI styling
├── search.min.js     # Core logic
├── 404.html          # Custom 404 page
├── 404.css           # 404 page styling
```

---

## Supported Input Formats

IMDb URL:

```
https://www.imdb.com/title/tt24060892/
```

IMDb ID:

```
tt24060892
```

---

## Configuration

To change the redirect destination, update the following variable in `search.min.js`:

```js
const REDIRECT_BASE_URL = "https://iiuo.org/?id=";
```

---

## Deployment

1. Upload the project files to your web server or CDN.
2. Ensure HTTPS is enabled.
3. Configure `/search` to point to `index.html`.
4. Test using multiple IMDb URLs and IDs.

---

## Browser Compatibility

Compatible with all modern browsers, including Chrome, Firefox, Edge, Safari, and mobile browsers.

---

# E-E-A-T Compliance

This project follows Google’s E-E-A-T principles (Experience, Expertise, Authoritativeness, Trustworthiness):

### Experience

* Built and tested as a real-world utility
* Designed for actual user workflows
* Includes error handling and accessibility considerations

### Expertise

* Uses strict IMDb ID validation
* Clean, maintainable JavaScript architecture
* Follows modern front-end best practices

### Authoritativeness

* No misleading claims or false affiliations
* Clear explanation of tool limitations
* Transparent project documentation

### Trustworthiness

* No data collection
* No hidden scripts
* No third-party dependencies
* Open-source and auditable codebase

---

# Terms of Service

By accessing or using this tool, you agree to comply with these Terms of Service and accept full responsibility for how the tool and any redirected links are used.

## Acceptance of Terms

By using this tool, you agree to these Terms of Service.

## Description of Service

This tool provides a client-side utility that processes IMDb identifiers and redirects users to a third-party URL.

## No Content Hosting

* This project does not host, stream, upload, or distribute any media.
* It does not scrape or modify IMDb content.
* It only processes publicly available identifiers.

## User Responsibility

Users are responsible for:

* How they use redirected links
* Compliance with local laws
* Compliance with third-party website terms

## Limitation of Liability

The authors of this project are not responsible for:

* Third-party content
* External website availability
* User misuse of the tool

## Changes to Terms

Terms may be updated at any time without prior notice.

---

# Privacy Policy

This tool does not collect, store, or process any personal data, and all functionality operates entirely within the user’s browser without tracking or analytics.

## Data Collection

This tool does **not** collect:

* Personal data
* IP addresses
* Cookies
* Analytics
* User input storage

## Data Processing

* All processing happens locally in the user’s browser.
* No data is transmitted to any server owned by this project.

## Third-Party Links

Redirect destinations are external websites.
This project is not responsible for their privacy practices.

## Children’s Privacy

This tool is not directed at children and does not knowingly collect any personal information.

---

# Disclaimer

* This project is not affiliated with IMDb.
* IMDb is a trademark of its respective owner.
* This tool is provided for educational and informational purposes only.

---

# License

This project is released for educational and informational use.
You are free to modify and adapt it according to your needs.
