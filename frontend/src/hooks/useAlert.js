import { useState } from 'react';

export const useAlert = () => {
  const [alert, setAlert] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    confirmText: 'OK',
    cancelText: null,
    onConfirm: null,
    onCancel: null,
  });

  const showAlert = ({
    title,
    message,
    type = 'info',
    confirmText = 'OK',
    cancelText = null,
    onConfirm = null,
    onCancel = null,
  }) => {
    setAlert({
      isOpen: true,
      title,
      message,
      type,
      confirmText,
      cancelText,
      onConfirm,
      onCancel,
    });
  };

  const showSuccess = (message, title = 'Success') => {
    showAlert({ title, message, type: 'success' });
  };

  const showError = (message, title = 'Error') => {
    showAlert({ title, message, type: 'error' });
  };

  const showWarning = (message, title = 'Warning') => {
    showAlert({ title, message, type: 'warning' });
  };

  const showInfo = (message, title = 'Information') => {
    showAlert({ title, message, type: 'info' });
  };

  const showConfirm = (message, onConfirm, title = 'Confirm') => {
    showAlert({
      title,
      message,
      type: 'warning',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      onConfirm,
    });
  };

  const hideAlert = () => {
    setAlert((prev) => ({ ...prev, isOpen: false }));
  };

  return {
    alert,
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
    hideAlert,
  };
};