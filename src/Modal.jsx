import './assets/Modal.css';

/**
 * Modal component for displaying detailed user information
 * @param {Object} props - Component props
 * @param {boolean} props.show - Controls modal visibility
 * @param {Function} props.onCloseButtonClick - Close button handler
 * @param {Object} props.user - User data to display
 */
const Modal = ({ show, onCloseButtonClick, user }) => {
  // Don't render if show is false
  if (!show) {
    return null;
  }

  return (
    <div className="modal-wrapper">
      <div className="modal">
        <div className="body">
          {/* Modal header with user image and close button */}
          <div className='modal-header'>
            <img 
              src={user.image} 
              alt={`${user.firstName} ${user.lastName}`} 
            />
            <button 
              onClick={onCloseButtonClick} 
              className='closeButton'
              aria-label="Close modal"
            >
              <img src='src/assets/close.svg' alt="Close" />
            </button>
          </div>

          {/* User details section */}
          <div className="user-details">
            <DetailItem label="Full Name" value={`${user.firstName} ${user.lastName}`} />
            <DetailItem label="Age" value={user.age} />
            <DetailItem 
              label="Address" 
              value={`${user.address.address}, ${user.address.city}, ${user.address.state}, ${user.address.country}`} 
            />
            <DetailItem label="Height" value={`${user.height} cm`} />
            <DetailItem label="Weight" value={`${user.weight} kg`} />
            <DetailItem label="Phone Number" value={user.phone} />
            <DetailItem label="Email" value={user.email} />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Helper component for consistent detail item rendering
 * @param {Object} props - Component props
 * @param {string} props.label - Label text
 * @param {string} props.value - Value text
 */
const DetailItem = ({ label, value }) => (
  <>
    <p className='label'>{label}:</p>
    <p>{value}</p>
  </>
);

export default Modal;