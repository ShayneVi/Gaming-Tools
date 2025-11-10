# ShayneVi Portfolio Website

This is a professional portfolio website showcasing gaming tools and utilities.

## ⚡ Quick Start: Update Compatibility List

**To add or update games in the compatibility list:**

1. Open `docs/compatibility-data.json`
2. Add your game using this template:

```json
{
  "name": "Your Game Name",
  "appId": "12345",
  "status": "works",
  "notes": "Brief note about compatibility",
  "lastTested": "2025-11-10"
}
```

3. **Status options**: `works`, `fails`, `untested`
4. Save and commit!

That's it! The website updates automatically. 🎉

---

## 🌐 Live Website

To publish this website using GitHub Pages:

1. Go to your repository settings
2. Navigate to "Pages" section
3. Under "Source", select the `main` branch and `/docs` folder
4. Click "Save"
5. Your website will be available at: `https://shayneVi.github.io/Global-OnlineFix-Unsteam/`

## 📁 File Structure

```
docs/
├── index.html              # Main homepage
├── compatibility.html      # Compatibility list page
├── styles.css             # Main stylesheet
├── compatibility.css      # Compatibility page styles
├── script.js              # Main JavaScript
├── compatibility.js       # Compatibility page logic
├── compatibility-data-sample.json  # Sample data structure
└── README.md             # This file
```

## 🎨 Features

- **Responsive Design**: Works on all devices
- **Modern UI**: Clean, professional interface with smooth animations
- **App Showcase**: Display all your gaming tools with descriptions
- **Compatibility Database**: Interactive table for game compatibility
- **Search & Filter**: Easy navigation of compatibility data
- **GitHub Integration**: Direct links to repositories

## 📊 Adding Compatibility Data

### Option 1: JSON Format (Recommended)

The file `compatibility-data.json` is already created in the `docs/` folder with the Unsteam compatibility data:

```json
[
  {
    "name": "Game Name",
    "appId": "123456",
    "status": "works",
    "notes": "Optional notes about compatibility",
    "lastTested": "2025-11-10"
  }
]
```

**Status Options:**
- `works` - Fully compatible with Unsteam
- `fails` - Does not work with Unsteam
- `untested` - Not yet verified

### Option 2: XML Format

Create a file named `compatibility-data.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<games>
  <game>
    <name>Game Name</name>
    <appId>123456</appId>
    <status>works</status>
    <notes>Optional notes</notes>
    <lastTested>2025-11-10</lastTested>
  </game>
</games>
```

Then update `compatibility.js` line 37 to load XML:
```javascript
loadFromXML('compatibility-data.xml');
```

## 🔗 Updating Links

To add or modify app links, edit `index.html` and update the app cards in the "Apps Section".

## 🎯 Customization

### Colors

Edit CSS variables in `styles.css`:
```css
:root {
    --primary: #667eea;
    --secondary: #764ba2;
    --accent: #f093fb;
    /* ... */
}
```

### Content

- **Hero Section**: Edit the title and subtitle in `index.html` (lines 32-34)
- **App Cards**: Update app descriptions in the `.app-card` divs
- **Footer**: Modify footer content at the bottom of `index.html`

## 🚀 Testing Locally

To test the website locally:

1. Simply open `index.html` in your browser, or
2. Use a local server:
   ```bash
   # Python 3
   python -m http.server 8000

   # Python 2
   python -m SimpleHTTPServer 8000

   # Node.js (with http-server)
   npx http-server
   ```

3. Navigate to `http://localhost:8000`

## 📱 Responsive Breakpoints

- Desktop: > 768px
- Tablet: 768px
- Mobile: < 480px

## ✨ Easter Egg

Try the Konami code on the homepage: ↑ ↑ ↓ ↓ ← → ← → B A

## 📄 License

This website is part of the Global-OnlineFix-Unsteam project and follows the same license.
