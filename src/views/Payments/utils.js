export const errorToast = (toast, message, error) => {
  if (error.response) {
    toast.error(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true
    });
  } else {
    toast.error("can't connect to server, check internet connection.", {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true
    });
  }
};
