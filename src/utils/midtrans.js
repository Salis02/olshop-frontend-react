export const midtransConfig = () => {
    return new Promise((resolve, reject) => {
        if (window && window.snap) {
            resolve(window.snap);
            return;
        }

        const script = document.createElement('script');
        const clientKey = process.env.REACT_APP_PAYMENT_CLIENT_KEY || '';

        const isProduction = false; // Change to true for production
        script.src = isProduction
            ? 'https://app.midtrans.com/snap/snap.js'
            : 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', clientKey);
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Midtrans SDK failed to load'));
        document.body.appendChild(script);
    })
}