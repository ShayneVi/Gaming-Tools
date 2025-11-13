// Compatibility data - loaded from JSON file
let compatibilityData = [];

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Loading compatibility data from JSON file...');

    // Load from JSON file
    loadCompatibilityData();

    // Setup search
    setupSearch();

    // Setup filters
    setupFilters();

    // Add scroll animation to navbar
    setupNavbar();
});

// Load compatibility data from JSON file
async function loadCompatibilityData() {
    try {
        // Try loading from GitHub first (for live updates)
        const githubUrl = 'https://raw.githubusercontent.com/ShayneVi/Gaming-Tools/main/docs/compatibility-data.json';

        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();

        try {
            console.log('Attempting to load from GitHub...');
            const githubResponse = await fetch(`${githubUrl}?v=${timestamp}`);
            if (githubResponse.ok) {
                const fetchedData = await githubResponse.json();
                compatibilityData = fetchedData;
                console.log(`✓ Loaded from GitHub (${compatibilityData.length} games)`);
                populateTable(compatibilityData);
                updateStats(compatibilityData);
                return;
            }
        } catch (githubError) {
            console.log('GitHub fetch failed, trying local file...');
        }

        // Fallback to local file if GitHub fails
        const response = await fetch(`compatibility-data.json?v=${timestamp}`);
        if (response.ok) {
            const fetchedData = await response.json();
            compatibilityData = fetchedData;
            console.log(`✓ Loaded from local file (${compatibilityData.length} games)`);
            populateTable(compatibilityData);
            updateStats(compatibilityData);
        } else {
            console.error('Failed to load compatibility-data.json');
            showErrorMessage('Failed to load game compatibility data');
        }
    } catch (error) {
        console.error('Error loading compatibility data:', error);
        showErrorMessage('Error loading game compatibility data. Please refresh the page.');
    }
}

// Show error message to user
function showErrorMessage(message) {
    const tbody = document.getElementById('compatTableBody');
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 2rem; color: #ef4444;">${message}</td></tr>`;
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
console.log('Data is loaded from GitHub (with local fallback)');
console.log('To update: Edit compatibility-data.json on GitHub and push - changes will appear automatically for all users!');
