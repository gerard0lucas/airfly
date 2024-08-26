document.addEventListener("DOMContentLoaded", function() {
    const merchantId = 'PGTESTPAYUAT';
    const apiKey = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';

    const paymentData = {
        merchantId: merchantId,
        merchantTransactionId: 'test123',
        merchantUserId: 'test customer',
        amount: 1000, // Amount in paisa (10 INR)
        redirectUrl: 'https://koshyshospital.com/payment/paymentsucess.php',
        redirectMode: 'POST',
        callbackUrl: 'https://koshyshospital.com/payment/paymentsucess.php',
        merchantOrderId: '123456',
        mobileNumber: '9845984591',
        message: 'test',
        email: 'test@gmail.com',
        shortName: 'test name',
        paymentInstrument: {
            type: 'PAY_PAGE',
        },
    };

    // Encode the payload
    const jsonencode = JSON.stringify(paymentData);
    const payloadMain = btoa(jsonencode); // Base64 encoding

    // Create payload for hash
    const payload = payloadMain + '/pg/v1/pay' + apiKey;
    crypto.subtle.digest('SHA-256', new TextEncoder().encode(payload))
        .then(hash => {
            const hexArray = Array.from(new Uint8Array(hash))
                .map(b => b.toString(16).padStart(2, '0'));
            return hexArray.join('');
        })
        .then(sha256Hash => {
            const final_x_header = sha256Hash + '###' + 1;
            const request = JSON.stringify({ request: payloadMain });

            // Make the request using Fetch API
            fetch('https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-VERIFY': final_x_header,
                    'accept': 'application/json',
                },
                body: request,
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);

                // Uncomment the following lines if you want to handle the response
                // if (data.success && data.success === '1') {
                //     const paymentCode = data.code;
                //     const paymentMsg = data.message;
                //     const payUrl = data.data.instrumentResponse.redirectInfo.url;
                //     window.location.href = payUrl;
                // }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        })
        .catch(err => {
            console.error('Error calculating hash:', err);
        });
});
