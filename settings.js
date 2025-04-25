// Get DOM elements
const medicineForm = document.getElementById('medicineForm');
const reminderForm = document.getElementById('reminderForm');
const resetBtn = document.getElementById('resetBtn');
const selectMedicine = document.getElementById('selectMedicine');

// Load existing medicines into the select dropdown
function loadMedicineOptions() {
    const medicines = JSON.parse(localStorage.getItem('medicineStock')) || [];
    selectMedicine.innerHTML = '<option value="">Select a medicine</option>';
    medicines.forEach(med => {
        const option = document.createElement('option');
        option.value = med.name;
        option.textContent = med.name;
        selectMedicine.appendChild(option);
    });
}

// Handle medicine form submission
medicineForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const medicineName = document.getElementById('medicineName').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const lowStockAlert = parseInt(document.getElementById('lowStockAlert').value);
    const expiryDate = document.getElementById('expiryDate').value;

    // Get existing medicines or initialize empty array
    const medicines = JSON.parse(localStorage.getItem('medicineStock')) || [];
    
    // Add new medicine
    medicines.push({
        name: medicineName,
        total: quantity,
        lowStockThreshold: lowStockAlert,
        expiryDate: expiryDate
    });

    // Save to localStorage
    localStorage.setItem('medicineStock', JSON.stringify(medicines));
    
    // Update medicine select options
    loadMedicineOptions();
    
    // Reset form
    medicineForm.reset();
    alert('Medicine added successfully!');
});

// Handle reminder form submission
reminderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const time = document.getElementById('reminderTime').value;
    const medicine = document.getElementById('selectMedicine').value;
    const dosage = document.getElementById('dosage').value;

    // Get existing schedules or initialize empty array
    const schedules = JSON.parse(localStorage.getItem('medicineSchedule')) || {};
    
    // Create a new schedule entry
    const newSchedule = {
        time: time,
        greeting: `Time to take ${medicine}!`,
        message: 'Please take your medicine:',
        medicines: [`${medicine} - ${dosage}`]
    };

    // Add to schedules
    schedules[time] = newSchedule;

    // Save to localStorage
    localStorage.setItem('medicineSchedule', JSON.stringify(schedules));
    
    // Reset form
    reminderForm.reset();
    alert('Reminder set successfully!');
});

// Handle reset button click
resetBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
        // Clear all medicine and schedule data
        localStorage.removeItem('medicineStock');
        localStorage.removeItem('medicineSchedule');
        
        // Reset forms and select options
        medicineForm.reset();
        reminderForm.reset();
        loadMedicineOptions();
        
        alert('All data has been reset successfully.');
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadMedicineOptions();
});
