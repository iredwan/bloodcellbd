import Swal from 'sweetalert2';

/**
 * Shows a delete confirmation dialog using SweetAlert2
 * 
 * @param {Object} options - Configuration options for the confirmation dialog
 * @param {string} options.title - The title of the confirmation dialog (default: 'Are you sure?')
 * @param {string} options.text - The description text (default: 'This action cannot be undone!')
 * @param {string} options.confirmButtonText - Text for the confirm button (default: 'Yes')
 * @param {string} options.cancelButtonText - Text for the cancel button (default: 'Cancel')
 * @param {string} options.icon - Icon to display (default: 'warning')
 * @returns {Promise<boolean>} - Resolves to true if confirmed, false if cancelled
 */
const confirm = async ({
  title = 'Are you sure?',
  text = 'This action cannot be undone!',
  confirmButtonText = 'Yes',
  cancelButtonText = 'Cancel',
  icon = 'warning'
} = {}) => {
  try {
    const result = await Swal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonColor: '#ef4444', // red-500
      cancelButtonColor: '#6b7280', // gray-500
      confirmButtonText,
      cancelButtonText,
      reverseButtons: true,
      focusCancel: true,
    });

    return result.isConfirmed;
  } catch (error) {
    console.error('Error showing delete confirmation:', error);
    return false;
  }
};

export default confirm; 

