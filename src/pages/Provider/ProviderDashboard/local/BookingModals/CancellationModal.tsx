
import Modal from 'react-modal';
import styles from './BookingModals.module.css';
import { useState } from 'react';
import * as bookingService from "../common/Services/booking.service"

interface CancellationModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  msClient: any;
  selectedEvent: any;
  eventsData: any[];
  setEventsData: (data: any) => void;
  setLoading: (loading: boolean) => void;
  closeCancellationPopup: () => void;
}

const CancellationModal: React.FC<CancellationModalProps> = ({
  isOpen,
  onRequestClose,
  msClient,
  selectedEvent,
  eventsData,
  setEventsData,
  setLoading,
  closeCancellationPopup
}) => {

  const handleCancellation = async () => {
    if (!msClient || !selectedEvent) {
      console.error("Client or selected event is missing.");
      return;
    }
    setLoading(true);
    // const cancel = {
    //   cancellationMessage: cancellationReason,
    // };

    try {
     await bookingService.deleteBooking({
            selectedEvent,
            //  setEventsData: setEventsData,
           });

      setEventsData(
        eventsData.filter((event) => event.id !== selectedEvent.id)
      );
      setCancellationReason("");
      closeCancellationPopup();
    } catch (error: any) {
      console.error("Error details:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

   const [cancellationReason, setCancellationReason] = useState("");
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Cancel Meeting"
      className={`${styles.modal} ${styles.modalSmall}`}
      overlayClassName={styles.overlay}
    >
      <div className={styles.modalDialog} role="document">
        <div className={styles.modalContent}>
          <div className={styles.modalHeader} style={{ paddingBottom: '2px' }}>
            <h4 className={styles.heading}>Cancel Appointment</h4>
            <button type="button" className={styles.close} onClick={onRequestClose}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className={styles.formGroup}>
            <textarea
              placeholder="Enter cancellation reason..."
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              style={{ height: '100px' }}
            />
          </div>
          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={handleCancellation}
            >
              Send Cancellation
            </button>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={onRequestClose}
            >
              Discard
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CancellationModal;
