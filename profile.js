// DOM Elements
const viewProfile = document.getElementById('viewProfile');
const editProfile = document.getElementById('editProfile');
const editButton = document.getElementById('editButton');
const cancelButton = document.getElementById('cancelEdit');
const profileForm = document.getElementById('profileForm');
const profileInfo = document.getElementById('profileInfo');

// Profile fields
const fields = [
    { id: 'Name', icon: 'user', label: 'Full Name' },
    { id: 'Age', icon: 'calendar-alt', label: 'Age' },
    { id: 'Gender', icon: 'venus-mars', label: 'Gender' },
    { id: 'Phone', icon: 'phone', label: 'Phone Number' },
    { id: 'Email', icon: 'envelope', label: 'Email' },
    { id: 'Address', icon: 'location-dot', label: 'Address' },
    { id: 'EmergencyContact', icon: 'phone-volume', label: 'Emergency Contact' },
    { id: 'BloodGroup', icon: 'droplet', label: 'Blood Group' },
    { id: 'Allergies', icon: 'exclamation-circle', label: 'Allergies' }
];

// Load profile data from localStorage
function loadProfile() {
    const profileData = JSON.parse(localStorage.getItem('profileData')) || {};
    
    // Update view mode
    document.getElementById('profileName').textContent = profileData.Name || 'Your Name';
    document.getElementById('profileTagline').textContent = profileData.Tagline || 'Your Health Journey';

    // Update profile info section with validation
    profileInfo.innerHTML = fields.map(field => {
        const value = profileData[field.id] || 'Not set';
        return `
            <div class="info-item">
                <i class="fas fa-${field.icon}"></i>
                <div class="info-content">
                    <label>${field.label}</label>
                    <span>${value}</span>
                </div>
            </div>
        `;
    }).join('');

    // Fill edit form with saved data
    fields.forEach(field => {
        const input = document.getElementById('input' + field.id);
        if (input) {
            input.value = profileData[field.id] || '';
        }
    });
    
    // Fill tagline field
    const taglineInput = document.getElementById('inputTagline');
    if (taglineInput) {
        taglineInput.value = profileData.Tagline || '';
    }
}

// Validate form data
function validateForm(formData) {
    const errors = [];
    
    // Required field validation
    if (!formData.get('inputName')) errors.push('Name is required');
    if (!formData.get('inputAge')) errors.push('Age is required');
    if (!formData.get('inputGender')) errors.push('Gender is required');
    
    // Phone number validation
    const phone = formData.get('inputPhone');
    if (phone && !/^\d{10}$/.test(phone)) {
        errors.push('Phone number must be 10 digits');
    }
    
    // Email validation
    const email = formData.get('inputEmail');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Invalid email format');
    }
    
    return errors;
}

// Save profile data with validation
function saveProfile(formData) {
    const errors = validateForm(formData);
    if (errors.length > 0) {
        alert('Please correct the following errors:\n' + errors.join('\n'));
        return false;
    }

    const profileData = {};
    fields.forEach(field => {
        const value = formData.get('input' + field.id);
        if (value) {
            profileData[field.id] = value.trim();
        }
    });
    
    profileData.Tagline = formData.get('inputTagline')?.trim() || 'Your Health Journey';
    
    try {
        localStorage.setItem('profileData', JSON.stringify(profileData));
        loadProfile();
        alert('Profile saved successfully!');
        return true;
    } catch (error) {
        console.error('Error saving profile:', error);
        alert('Failed to save profile. Please try again.');
        return false;
    }
}

// Event Listeners
editButton.addEventListener('click', () => {
    viewProfile.style.display = 'none';
    editProfile.style.display = 'block';
});

cancelButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
        viewProfile.style.display = 'block';
        editProfile.style.display = 'none';
        loadProfile(); // Reset form to saved values
    }
});

profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(profileForm);
    if (saveProfile(formData)) {
        viewProfile.style.display = 'block';
        editProfile.style.display = 'none';
    }
});

// Initialize profile on page load
document.addEventListener('DOMContentLoaded', loadProfile);
