import toast from 'react-hot-toast';

export const showToast = {
    success: (message) => {
        toast.success(message);
    },

    error: (message) => {
        toast.error(message);
    },

    loading: (message) => {
        return toast.loading(message);
    },

    dismiss: (toastId) => {
        toast.dismiss(toastId);
    },

    promise: (promise, messages) => {
        return toast.promise(promise, {
            loading: messages.loading || 'Loading...',
            success: messages.success || 'Success!',
            error: messages.error || 'Something went wrong',
        });
    }
};

// Confirmation toast with custom UI
export const showConfirm = (message, onConfirm) => {
    toast((t) => (
        <div className="flex flex-col space-y-3">
            <p className="font-medium">{message}</p>
            <div className="flex space-x-2">
                <button
                    onClick={() => {
                        onConfirm();
                        toast.dismiss(t.id);
                    }}
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                    Yes
                </button>
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                    Cancel
                </button>
            </div>
        </div>
    ), {
        duration: Infinity,
        style: {
            background: '#fff',
            color: '#333',
        }
    });
};