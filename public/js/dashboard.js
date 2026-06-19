function getDecodedToken() {
    const token = getAuthToken();
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

function switchTab(tabId) {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    const activeBtn = Array.from(tabBtns).find(btn => btn.getAttribute('onclick').includes(tabId));
    if (activeBtn) activeBtn.classList.add('active');

    const activeContent = document.getElementById(tabId);
    if (activeContent) activeContent.classList.add('active');
}

async function fetchUserRegistrations() {
    const container = document.getElementById('registrations-list');
    if (!container) return;

    const token = getAuthToken();
    if (!token) return;

    try {
        const response = await fetch('/api/registrations', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const registrations = await response.json();

        if (!response.ok) throw new Error(registrations.message || 'Failed to load registrations');

        if (registrations.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    You have not registered for any events yet.<br>
                    <a href="/events" class="btn btn-primary btn-sm" style="margin-top: 1rem;">Browse Available Events</a>
                </div>
            `;
            return;
        }

        container.innerHTML = registrations.map(reg => {
            const ev = reg.Event;
            if (!ev) return '';
            const desc = ev.description.length > 100 ? ev.description.substring(0, 100) + '...' : ev.description;
            return `
                <article class="card">
                    <div class="card-content">
                        <span class="card-badge" style="position:static; margin-bottom: 0.5rem; width: fit-content; border-color: rgba(52, 211, 153, 0.3); color: var(--success);">Confirmed</span>
                        <h3 class="card-title">${escapeHtml(ev.title)}</h3>
                        <p class="card-desc">${escapeHtml(desc)}</p>
                        <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">
                            <div><strong>Date:</strong> ${escapeHtml(formatDate(ev.startDate))}</div>
                        </div>
                        <div class="ticket-box">
                            <div>
                                <div style="font-size: 0.75rem; color: var(--text-secondary);">Ticket Code</div>
                                <div class="ticket-code">${escapeHtml(reg.ticketCode)}</div>
                            </div>
                            <div aria-hidden="true">
                                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                            </div>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-top: 1.5rem;">
                            <a href="/event/${reg.eventId}" class="btn btn-secondary btn-sm">Event Page</a>
                            <button onclick="cancelBooking(${reg.id})" class="btn btn-danger btn-sm">Cancel Registration</button>
                        </div>
                    </div>
                </article>
            `;
        }).join('');

    } catch (err) {
        container.innerHTML = `<div class="error-state">${escapeHtml(err.message)}</div>`;
    }
}

async function cancelBooking(regId) {
    if (!confirm('Are you sure you want to cancel this registration?')) return;

    const token = getAuthToken();
    try {
        const response = await fetch(`/api/registrations/${regId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Failed to cancel registration');

        showToast('Registration cancelled. Your seat has been released.', 'success');
        await fetchUserRegistrations();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function fetchNotifications() {
    const list = document.getElementById('notifications-list');
    if (!list) return;

    const token = getAuthToken();
    try {
        const response = await fetch('/api/notifications/user', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const notifications = await response.json();

        if (!response.ok) throw new Error(notifications.message || 'Failed to load notifications');

        const unread = notifications.filter(n => !n.isRead);
        const countBadge = document.getElementById('unread-count');
        if (countBadge) {
            if (unread.length > 0) {
                countBadge.textContent = unread.length;
                countBadge.style.display = 'inline';
            } else {
                countBadge.style.display = 'none';
            }
        }

        if (notifications.length === 0) {
            list.innerHTML = '<div class="empty-state">You have no notifications at this time.</div>';
            return;
        }

        list.innerHTML = notifications.map(n => {
            const classUnread = n.isRead ? '' : 'unread';
            const actionBtn = n.isRead ? '' : `<button onclick="markNotificationRead(${n.id})" class="btn btn-secondary btn-sm" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;">Mark Read</button>`;

            return `
                <div class="notif-item ${classUnread}">
                    <div>
                        <h3>${escapeHtml(n.title)}</h3>
                        <p>${escapeHtml(n.message)}</p>
                        <span class="notif-date">${escapeHtml(formatDate(n.createdAt))}</span>
                    </div>
                    <div>${actionBtn}</div>
                </div>
            `;
        }).join('');

    } catch (err) {
        list.innerHTML = `<div class="error-state">${escapeHtml(err.message)}</div>`;
    }
}

async function markNotificationRead(notifId) {
    const token = getAuthToken();
    try {
        const response = await fetch(`/api/notifications/mark-as-read/${notifId}`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            await fetchNotifications();
        }
    } catch (err) {
        console.error(err);
    }
}

async function fetchAdminEvents() {
    const list = document.getElementById('admin-events-list');
    if (!list) return;

    try {
        const response = await fetch('/api/events');
        const events = await response.json();

        if (!response.ok) throw new Error('Failed to load events');

        const payload = getDecodedToken();
        if (!payload) return;

        const managedEvents = payload.role === 'admin'
            ? events
            : events.filter(e => e.organizerId === payload.id);

        if (managedEvents.length === 0) {
            list.innerHTML = '<tr><td colspan="7" class="empty-state">You have no managed events yet. Click "Add New Event" to get started.</td></tr>';
            return;
        }

        list.innerHTML = managedEvents.map(e => {
            const price = formatPrice(e.price);
            const dateFormatted = formatDate(e.startDate).split(',')[0];
            return `
                <tr>
                    <td><strong>${escapeHtml(e.title)}</strong></td>
                    <td style="font-size: 0.9rem;">${escapeHtml(dateFormatted)}</td>
                    <td>${escapeHtml(e.location)}</td>
                    <td>${e.capacity}</td>
                    <td>${e.availableSeats}</td>
                    <td>${escapeHtml(price)}</td>
                    <td>
                        <div style="display: flex; gap: 0.5rem;">
                            <button onclick="openEditModal(${e.id})" class="btn btn-secondary btn-sm">Edit</button>
                            <button onclick="deleteAdminEvent(${e.id})" class="btn btn-danger btn-sm">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

    } catch (err) {
        list.innerHTML = `<tr><td colspan="7" class="error-state">${escapeHtml(err.message)}</td></tr>`;
    }
}

async function openCreateModal() {
    const form = document.getElementById('event-form');
    if (!form) return;

    form.reset();
    document.getElementById('event-id').value = '';
    document.getElementById('modal-title').textContent = 'Add New Event';

    await fetchCategories();

    document.getElementById('event-modal').style.display = 'block';
    document.getElementById('title').focus();
}

async function openEditModal(eventId) {
    const form = document.getElementById('event-form');
    if (!form) return;

    try {
        const response = await fetch(`/api/events/${eventId}`);
        const event = await response.json();

        if (!response.ok) throw new Error(event.message || 'Failed to load event data');

        await fetchCategories();

        document.getElementById('event-id').value = event.id;
        document.getElementById('modal-title').textContent = 'Edit Event';
        document.getElementById('title').value = event.title;
        document.getElementById('categoryId').value = event.categoryId;
        document.getElementById('price').value = parseFloat(event.price).toFixed(0);
        document.getElementById('description').value = event.description;
        document.getElementById('thumbnail').value = event.thumbnail;
        document.getElementById('location').value = event.location;
        document.getElementById('address').value = event.address;

        const localStart = new Date(event.startDate).toISOString().slice(0, 16);
        const localEnd = new Date(event.endDate).toISOString().slice(0, 16);
        document.getElementById('startDate').value = localStart;
        document.getElementById('endDate').value = localEnd;

        document.getElementById('capacity').value = event.capacity;

        document.getElementById('event-modal').style.display = 'block';
        document.getElementById('title').focus();

    } catch (err) {
        showToast(err.message, 'error');
    }
}

function closeEventModal() {
    const modal = document.getElementById('event-modal');
    if (modal) modal.style.display = 'none';
}

async function deleteAdminEvent(eventId) {
    if (!confirm('Are you sure you want to permanently delete this event? This action cannot be undone.')) return;

    const token = getAuthToken();
    try {
        const response = await fetch(`/api/events/${eventId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Failed to delete event');

        showToast('Event deleted successfully.', 'success');
        await fetchAdminEvents();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const user = getAuthUser();
    const greeting = document.getElementById('user-greeting');
    if (user && greeting) {
        greeting.textContent = `Welcome, ${user.name}`;
    }

    const roleLbl = document.getElementById('user-role-lbl');
    if (roleLbl && user) {
        if (user.role === 'admin') roleLbl.textContent = 'System Administration Dashboard';
        else if (user.role === 'organizer') roleLbl.textContent = 'Event Organizer Dashboard';
        else roleLbl.textContent = 'Your Personal Dashboard';
    }

    const orgActions = document.getElementById('organizer-actions');
    if (orgActions && user && ['organizer', 'admin'].includes(user.role)) {
        orgActions.style.display = 'block';
    }

    fetchUserRegistrations();
    fetchNotifications();
    fetchAdminEvents();

    const eventForm = document.getElementById('event-form');
    if (eventForm) {
        eventForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const token = getAuthToken();
            const eventId = document.getElementById('event-id').value;

            const payload = {
                title: document.getElementById('title').value.trim(),
                categoryId: parseInt(document.getElementById('categoryId').value, 10),
                price: parseFloat(document.getElementById('price').value),
                description: document.getElementById('description').value.trim(),
                thumbnail: document.getElementById('thumbnail').value.trim(),
                location: document.getElementById('location').value.trim(),
                address: document.getElementById('address').value.trim(),
                startDate: new Date(document.getElementById('startDate').value).toISOString(),
                endDate: new Date(document.getElementById('endDate').value).toISOString(),
                capacity: parseInt(document.getElementById('capacity').value, 10)
            };

            const isEdit = !!eventId;
            const url = isEdit ? `/api/events/${eventId}` : '/api/events';
            const method = isEdit ? 'PUT' : 'POST';

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (!response.ok) throw new Error(data.message || 'Failed to save event');

                showToast(isEdit ? 'Event updated successfully!' : 'Event published successfully!', 'success');
                closeEventModal();
                await fetchAdminEvents();
            } catch (err) {
                showToast(err.message, 'error');
            }
        });
    }

    const modal = document.getElementById('event-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeEventModal();
        });
    }
});
