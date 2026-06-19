let currentEventId = null;
let currentEvent = null;

function getEventIdFromUrl() {
    const pathParts = window.location.pathname.split('/');
    return pathParts[pathParts.length - 1];
}

function injectStructuredData(event) {
    const existing = document.getElementById('event-schema-jsonld');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.id = 'event-schema-jsonld';
    script.type = 'application/ld+json';

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: event.title,
        startDate: event.startDate,
        endDate: event.endDate,
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        location: {
            '@type': 'Place',
            name: event.location,
            address: {
                '@type': 'PostalAddress',
                streetAddress: event.address,
                addressLocality: event.location
            }
        },
        image: [event.thumbnail],
        description: event.description,
        offers: {
            '@type': 'Offer',
            price: event.price,
            priceCurrency: 'USD',
            availability: event.availableSeats > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            validFrom: event.createdAt
        },
        organizer: {
            '@type': 'Organization',
            name: event.organizer ? event.organizer.name : 'Event Organizer',
            url: window.location.origin + '/'
        }
    };

    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    document.title = `${event.title} | EventPulse`;

    const metaDesc = document.getElementById('meta-description');
    if (metaDesc) metaDesc.setAttribute('content', event.description.substring(0, 160));

    const canonical = document.getElementById('canonical-url');
    if (canonical) canonical.setAttribute('href', `${window.location.origin}/event/${event.id}`);

    const ogTitle = document.getElementById('og-title');
    if (ogTitle) ogTitle.setAttribute('content', event.title);

    const ogDesc = document.getElementById('og-description');
    if (ogDesc) ogDesc.setAttribute('content', event.description.substring(0, 160));

    const ogImage = document.getElementById('og-image');
    if (ogImage) ogImage.setAttribute('content', event.thumbnail);

    const ogUrl = document.getElementById('og-url');
    if (ogUrl) ogUrl.setAttribute('content', `${window.location.origin}/event/${event.id}`);
}

async function loadEventDetails() {
    currentEventId = getEventIdFromUrl();
    if (!currentEventId || !/^\d+$/.test(currentEventId)) {
        showToast('Invalid event ID', 'error');
        return;
    }

    const loadingSection = document.getElementById('event-detail-loading');
    const contentSection = document.getElementById('event-detail-content');

    try {
        const response = await fetch(`/api/events/${currentEventId}`);
        currentEvent = await response.json();

        if (!response.ok) {
            throw new Error(currentEvent.message || 'Failed to load event details');
        }

        document.getElementById('event-thumbnail').src = currentEvent.thumbnail;
        document.getElementById('event-thumbnail').alt = currentEvent.title;
        document.getElementById('event-title').textContent = currentEvent.title;
        document.getElementById('event-description').textContent = currentEvent.description;
        document.getElementById('event-start-date').textContent = formatDate(currentEvent.startDate);
        document.getElementById('event-end-date').textContent = formatDate(currentEvent.endDate);
        document.getElementById('event-location').textContent = currentEvent.location;
        document.getElementById('event-address').textContent = currentEvent.address;
        document.getElementById('event-seats').textContent = currentEvent.availableSeats;
        document.getElementById('event-capacity').textContent = currentEvent.capacity;
        document.getElementById('event-organizer').textContent = currentEvent.organizer ? currentEvent.organizer.name : 'Community Organizer';

        const priceEl = document.getElementById('event-price');
        const price = parseFloat(currentEvent.price);
        priceEl.textContent = formatPrice(currentEvent.price);
        priceEl.className = price === 0 ? 'price-tag free' : 'price-tag';

        injectStructuredData(currentEvent);
        await checkBookingState();
        await fetchReviews();

        loadingSection.style.display = 'none';
        contentSection.style.display = 'grid';

    } catch (err) {
        loadingSection.innerHTML = `<div class="error-state"><h2>${escapeHtml(err.message)}</h2><p style="margin-top:1rem;"><a href="/events" class="btn btn-secondary">Back to Events</a></p></div>`;
    }
}

async function checkBookingState() {
    const registerBtn = document.getElementById('register-btn');
    if (!registerBtn) return;

    if (!isLoggedIn()) {
        registerBtn.textContent = 'Sign In to Register';
        registerBtn.onclick = () => { window.location.href = '/login'; };
        return;
    }

    const token = getAuthToken();
    try {
        const response = await fetch('/api/registrations', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const registrations = await response.json();

        if (response.ok) {
            const isBooked = registrations.some(reg => reg.eventId === parseInt(currentEventId, 10));
            const reviewFormContainer = document.getElementById('write-review-container');

            if (isBooked) {
                registerBtn.textContent = 'You Are Registered';
                registerBtn.className = 'btn btn-secondary btn-block';
                registerBtn.disabled = true;
                registerBtn.style.cursor = 'default';
                if (reviewFormContainer) reviewFormContainer.style.display = 'block';
            } else if (currentEvent.availableSeats <= 0) {
                registerBtn.textContent = 'Sorry, No Seats Available';
                registerBtn.className = 'btn btn-secondary btn-block';
                registerBtn.disabled = true;
            } else {
                registerBtn.textContent = 'Register Now';
                registerBtn.className = 'btn btn-primary btn-block';
                registerBtn.disabled = false;
                registerBtn.onclick = bookEvent;
            }
        }
    } catch (err) {
        console.error(err);
    }
}

async function bookEvent() {
    const token = getAuthToken();
    if (!token) return;

    const registerBtn = document.getElementById('register-btn');
    registerBtn.disabled = true;
    registerBtn.textContent = 'Registering...';

    try {
        const response = await fetch(`/api/registrations/${currentEventId}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        showToast('Registration confirmed! Check your dashboard for ticket details.', 'success');
        await loadEventDetails();

    } catch (err) {
        showToast(err.message, 'error');
        registerBtn.disabled = false;
        registerBtn.textContent = 'Register Now';
    }
}

async function fetchReviews() {
    const list = document.getElementById('reviews-list');
    if (!list) return;

    try {
        const response = await fetch(`/api/reviews/${currentEventId}`);
        const reviews = await response.json();

        if (response.ok && reviews.length > 0) {
            list.innerHTML = reviews.map(rev => {
                const stars = '★'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating);
                const authorName = rev.User ? rev.User.name : 'Attendee';
                return `
                    <div class="review-card">
                        <div class="review-header">
                            <strong>${escapeHtml(authorName)}</strong>
                            <span class="stars" aria-label="${rev.rating} out of 5 stars">${stars}</span>
                        </div>
                        <p style="font-size: 0.95rem; color: var(--text-primary);">${escapeHtml(rev.comment || 'No written comment.')}</p>
                    </div>
                `;
            }).join('');
        }
    } catch (err) {
        console.error(err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadEventDetails();

    const starContainer = document.getElementById('rating-stars');
    if (starContainer) {
        const stars = starContainer.querySelectorAll('.rating-star');
        stars.forEach(star => {
            star.addEventListener('click', function () {
                const value = this.getAttribute('data-value');
                document.getElementById('review-rating').value = value;
                stars.forEach(s => {
                    if (parseInt(s.getAttribute('data-value'), 10) <= parseInt(value, 10)) {
                        s.classList.add('selected');
                    } else {
                        s.classList.remove('selected');
                    }
                });
            });
        });

        stars.forEach(s => s.classList.add('selected'));
    }

    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const rating = document.getElementById('review-rating').value;
            const comment = document.getElementById('review-comment').value.trim();
            const token = getAuthToken();

            if (!token) return;

            try {
                const response = await fetch(`/api/reviews/${currentEventId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ rating, comment })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to submit review');
                }

                showToast('Thank you! Your review has been submitted.', 'success');
                reviewForm.reset();
                if (starContainer) {
                    starContainer.querySelectorAll('.rating-star').forEach(s => s.classList.add('selected'));
                }
                await fetchReviews();

            } catch (err) {
                showToast(err.message, 'error');
            }
        });
    }
});
