// Compatibility data - embedded directly to work with file:// protocol (no CORS issues)
let compatibilityData = [
  {"name": "Granny Escape Together", "appId": "0", "status": "works", "notes": "Online multiplayer confirmed working", "lastTested": "2025-11-10"},
  {"name": "Paint the Town Red", "appId": "337320", "status": "works", "notes": "LAN play confirmed. Online play works with Steam servers.", "lastTested": "2025-11-10"},
  {"name": "Mimesis", "appId": "0", "status": "works", "notes": "Multiplayer working", "lastTested": "2025-11-10"},
  {"name": "Hearts of Iron IV", "appId": "394360", "status": "works", "notes": "Multiplayer confirmed working", "lastTested": "2025-11-10"},
  {"name": "South Park: Snow Day", "appId": "2599080", "status": "works", "notes": "Online functionality confirmed", "lastTested": "2025-11-10"},
  {"name": "Escape Simulator", "appId": "1435790", "status": "works", "notes": "Multiplayer works perfectly", "lastTested": "2025-11-10"},
  {"name": "Stellaris", "appId": "281990", "status": "works", "notes": "Multiplayer confirmed working", "lastTested": "2025-11-10"},
  {"name": "Swapmeat", "appId": "0", "status": "works", "notes": "Works as expected", "lastTested": "2025-11-10"},
  {"name": "Europa Universalis IV", "appId": "236850", "status": "works", "notes": "Multiplayer confirmed working", "lastTested": "2025-11-10"},
  {"name": "Veins", "appId": "0", "status": "works", "notes": "Online features working", "lastTested": "2025-11-10"},
  {"name": "Tavern Keeper", "appId": "0", "status": "works", "notes": "Works correctly", "lastTested": "2025-11-10"},
  {"name": "Streets of Rage 4", "appId": "985890", "status": "works", "notes": "Multiplayer working", "lastTested": "2025-11-10"},
  {"name": "Inzoi", "appId": "0", "status": "fails", "notes": "Does not work with current version", "lastTested": "2025-11-10"},
  {"name": "Sons of the Forest", "appId": "1326470", "status": "fails", "notes": "Incompatible with Unsteam", "lastTested": "2025-11-10"},
  {"name": "PEAK", "appId": "0", "status": "fails", "notes": "Not working", "lastTested": "2025-11-10"},
  {"name": "FBC: Fireworks", "appId": "0", "status": "fails", "notes": "Does not work", "lastTested": "2025-11-10"},
  {"name": "For the King 2", "appId": "1676840", "status": "fails", "notes": "Not compatible", "lastTested": "2025-11-10"},
  {"name": "American Truck Simulator", "appId": "270880", "status": "fails", "notes": "Multiplayer not working with Unsteam", "lastTested": "2025-11-10"},
  {"name": "Grounded", "appId": "962130", "status": "fails", "notes": "Does not work", "lastTested": "2025-11-10"},
  {"name": "Dying Light", "appId": "239140", "status": "fails", "notes": "Incompatible", "lastTested": "2025-11-10"},
  {"name": "Warhammer: Darktide", "appId": "1361210", "status": "fails", "notes": "Not working with Unsteam", "lastTested": "2025-11-10"},
  {"name": "Warhammer 40,000: Rogue Trader", "appId": "2186680", "status": "fails", "notes": "Not compatible", "lastTested": "2025-11-10"},
  {"name": "Abiotic Factor", "appId": "427410", "status": "fails", "notes": "Does not work", "lastTested": "2025-11-10"},
  {"name": "Phasmophobia", "appId": "739630", "status": "fails", "notes": "Not working", "lastTested": "2025-11-10"}
];

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    console.log(`✓ Using embedded compatibility data (${compatibilityData.length} games)`);

    // Populate table and stats immediately with embedded data
    populateTable(compatibilityData);
    updateStats(compatibilityData);

    // Try to load from JSON file as well (for web server deployment)
    loadCompatibilityData();

    // Setup search
    setupSearch();

    // Setup filters
    setupFilters();

    // Add scroll animation to navbar
    setupNavbar();
});

// Load compatibility data from JSON file (optional - for web server deployment)
async function loadCompatibilityData() {
    try {
        // Try to load from compatibility-data.json (will fail with CORS on file://)
        const response = await fetch('compatibility-data.json');
        if (response.ok) {
            const fetchedData = await response.json();
            compatibilityData = fetchedData;
            console.log(`✓ Updated from compatibility-data.json (${compatibilityData.length} games)`);
            populateTable(compatibilityData);
            updateStats(compatibilityData);
        }
    } catch (error) {
        // Expected to fail with file:// protocol - embedded data is already loaded
        console.log('Note: Using embedded data (JSON fetch failed due to file:// protocol or network)');
    }
}

// Populate table with compatibility data
function populateTable(data) {
    const tbody = document.getElementById('compatTableBody');

    if (!data || data.length === 0) {
        // Keep the "Coming Soon" message
        console.log('No data to populate table');
        return;
    }

    console.log(`Populating table with ${data.length} games`);

    // Clear existing rows
    tbody.innerHTML = '';

    data.forEach((game, index) => {
        const row = document.createElement('tr');
        row.style.animationDelay = `${index * 0.05}s`;

        row.innerHTML = `
            <td><strong>${game.name}</strong></td>
            <td>${game.appId || 'N/A'}</td>
            <td>${getStatusBadge(game.status)}</td>
            <td>${game.notes || '—'}</td>
            <td>${game.lastTested || 'Unknown'}</td>
        `;

        tbody.appendChild(row);
    });

    console.log('✓ Table populated successfully');
}

// Get status badge HTML
function getStatusBadge(statusValue) {
    if (!statusValue) return '<span class="status-badge status-untested">?</span>';

    const statusMap = {
        'works': { icon: '✓', class: 'status-works' },
        'fails': { icon: '✗', class: 'status-fails' },
        'untested': { icon: '?', class: 'status-untested' }
    };

    const status = statusMap[statusValue] || statusMap['untested'];
    return `<span class="status-badge ${status.class}">${status.icon}</span>`;
}

// Update statistics
function updateStats(data) {
    if (!data || data.length === 0) return;

    const totalGames = data.length;
    let workingGames = 0;
    let failingGames = 0;

    data.forEach(game => {
        if (game.status === 'works') {
            workingGames++;
        } else if (game.status === 'fails') {
            failingGames++;
        }
    });

    document.getElementById('totalGames').textContent = totalGames;
    document.getElementById('workingGames').textContent = workingGames;
    document.getElementById('failingGames').textContent = failingGames;
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');

    if (!searchInput) {
        console.error('Search input not found!');
        return;
    }

    console.log('✓ Search functionality initialized');

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        console.log(`Searching for: "${searchTerm}"`);
        filterTable(searchTerm);
    });
}

// Filter table based on search term and active filter
function filterTable(searchTerm = '') {
    const tbody = document.getElementById('compatTableBody');
    const rows = tbody.querySelectorAll('tr');
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';

    console.log(`Filtering table: search="${searchTerm}", filter="${activeFilter}", rows=${rows.length}`);

    let visibleCount = 0;

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');

        // Skip placeholder rows (colspan rows have fewer cells)
        if (cells.length < 5) {
            console.log('Skipping placeholder row');
            return;
        }

        const gameName = cells[0]?.textContent.toLowerCase() || '';
        const appId = cells[1]?.textContent.toLowerCase() || '';

        const matchesSearch = searchTerm === '' || gameName.includes(searchTerm) || appId.includes(searchTerm);

        let matchesFilter = true;
        if (activeFilter !== 'all') {
            const statusBadge = cells[2]?.querySelector('.status-badge');

            if (activeFilter === 'works') {
                matchesFilter = statusBadge?.classList.contains('status-works');
            } else if (activeFilter === 'fails') {
                matchesFilter = statusBadge?.classList.contains('status-fails');
            }
        }

        const shouldShow = matchesSearch && matchesFilter;
        row.style.display = shouldShow ? '' : 'none';

        if (shouldShow) visibleCount++;
    });

    console.log(`✓ Filtered complete: ${visibleCount} games visible`);
}

// Setup filter buttons
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Apply filter
            const searchInput = document.getElementById('searchInput');
            filterTable(searchInput.value.toLowerCase());
        });
    });
}

// Setup navbar scroll effect
function setupNavbar() {
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Export data as CSV (utility function for future use)
function exportToCSV() {
    if (!compatibilityData || compatibilityData.length === 0) {
        alert('No data to export');
        return;
    }

    const headers = ['Game Name', 'App ID', 'Status', 'Notes', 'Last Tested'];
    const rows = compatibilityData.map(game => [
        game.name,
        game.appId || 'N/A',
        game.status || 'untested',
        game.notes || '',
        game.lastTested || 'Unknown'
    ]);

    const csv = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'unsteam-compatibility-list.csv';
    a.click();
    URL.revokeObjectURL(url);
}

// Function to load data from XML (for future use)
async function loadFromXML(xmlUrl) {
    try {
        const response = await fetch(xmlUrl);
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

        const games = xmlDoc.querySelectorAll('game');
        const data = [];

        games.forEach(game => {
            data.push({
                name: game.querySelector('name')?.textContent || '',
                appId: game.querySelector('appId')?.textContent || '',
                status: game.querySelector('status')?.textContent || 'untested',
                notes: game.querySelector('notes')?.textContent || '',
                lastTested: game.querySelector('lastTested')?.textContent || ''
            });
        });

        compatibilityData = data;
        populateTable(compatibilityData);
        updateStats(compatibilityData);
    } catch (error) {
        console.error('Error loading XML data:', error);
    }
}

// Console info
console.log('%c📊 Unsteam Compatibility Database', 'font-size: 16px; font-weight: bold; color: #667eea;');
console.log('Data is embedded in this file for offline use (works with file:// protocol).');
console.log('To update: Edit the compatibilityData array at the top of compatibility.js');
console.log('For web servers: Also update compatibility-data.json (will auto-load if available).');
