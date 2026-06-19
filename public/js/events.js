let allEvents = [];

async function fetchCategories() {
    const filterSelect = document.getElementById('category-filter');
    const formSelect = document.getElementById('categoryId');

    try {
        const response = await fetch('/api/categories');
        const categories = await response.json();

        if (!response.ok) throw new Error('Failed to load categories');

        if (filterSelect) {
            categories.forEach(cat => {
                const opt = document.createElement('option');
                opt.value = cat.id;
                opt.textContent = cat.name;
                filterSelect.appendChild(opt);
            });
        }

        if (formSelect) {
            formSelect.innerHTML = '<option value="">Select a category...</option>';
            categories.forEach(cat => {
                const opt = document.createElement('option');
                opt.value = cat.id;
                opt.textContent = cat.name;
                formSelect.appendChild(opt);
            });
        }
    } catch (err) {
        console.error(err);
    }
}

async function fetchEvents() {
    const container = document.getElementById('events-container');
    if (!container) return;

    try {
        const response = await fetch('/api/events');
        allEvents = await response.json();

        if (!response.ok) throw new Error('Failed to load events');

        renderEvents(allEvents);
    } catch (err) {
        container.innerHTML = `<div class="error-state">${escapeHtml(err.message)}</div>`;
    }
}

function renderEvents(eventsList) {
    const container = document.getElementById('events-container');
    if (!container) return;

    if (eventsList.length === 0) {
        container.innerHTML = '<div class="empty-state">No events match your search criteria.</div>';
        return;
    }

    container.innerHTML = eventsList.map(event => {
        const priceText = formatPrice(event.price);
        const priceClass = parseFloat(event.price) === 0 ? 'card-price free' : 'card-price';
        const seatColor = event.availableSeats === 0 ? 'color: var(--accent);' : '';
        const seatsText = event.availableSeats === 0 ? 'Sold Out' : `${event.availableSeats} seats left`;
        const desc = event.description.length > 120 ? event.description.substring(0, 120) + '...' : event.description;
        const categoryName = event.category ? event.category.name : 'General';
        const dateFormatted = formatDate(event.startDate).split(',')[0];

        return `
            <article class="card">
                <div class="card-img-wrapper">
                    <img src="${escapeHtml(event.thumbnail)}" alt="${escapeHtml(event.title)}" loading="lazy" width="400" height="225">
                    <span class="card-badge">${escapeHtml(categoryName)}</span>
                </div>
                <div class="card-content">
                    <h3 class="card-title">${escapeHtml(event.title)}</h3>
                    <p class="card-desc">${escapeHtml(desc)}</p>
                    <div class="card-meta">
                        <span>
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            ${escapeHtml(dateFormatted)}
                        </span>
                        <span style="${seatColor}">
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            ${escapeHtml(seatsText)}
                        </span>
                    </div>
                    <div class="card-footer">
                        <span class="${priceClass}">${escapeHtml(priceText)}</span>
                        <a href="/event/${event.id}" class="btn btn-secondary btn-sm">View Details</a>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

function initFilters() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');

    if (!searchInput && !categoryFilter) return;

    const filterHandler = () => {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const catId = categoryFilter ? categoryFilter.value : '';

        const filtered = allEvents.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(query) ||
                event.description.toLowerCase().includes(query) ||
                event.location.toLowerCase().includes(query);
            const matchesCategory = !catId || event.categoryId === parseInt(catId, 10);
            return matchesSearch && matchesCategory;
        });

        renderEvents(filtered);
    };

    if (searchInput) searchInput.addEventListener('input', filterHandler);
    if (categoryFilter) categoryFilter.addEventListener('change', filterHandler);
}

document.addEventListener('DOMContentLoaded', async () => {
    await fetchCategories();
    await fetchEvents();
    initFilters();
});
