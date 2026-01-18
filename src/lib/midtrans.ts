// Midtrans Snap Type Definitions
declare global {
    interface Window {
        snap: {
            pay: (token: string, options: {
                onSuccess: (result: any) => void
                onPending: (result: any) => void
                onError: (result: any) => void
                onClose: () => void
            }) => void
        }
    }
}

export interface PaymentResult {
    status_code: string
    status_message: string
    transaction_id: string
    order_id: string
    gross_amount: string
    payment_type: string
    transaction_time: string
    transaction_status: string
    fraud_status?: string
}

export interface PaymentDetails {
    orderId: string
    amount: number
    customerName: string
    customerEmail: string
    itemName: string
    itemPrice: number
}

// Create Midtrans Snap token via backend API
export async function createSnapToken(details: PaymentDetails): Promise<string> {
    try {
        console.log('Creating payment token via backend...')

        const response = await fetch('http://localhost:3001/api/payment/create-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                orderId: details.orderId,
                amount: details.amount,
                customerName: details.customerName,
                customerEmail: details.customerEmail,
                itemName: details.itemName
            })
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message || 'Failed to create payment token')
        }

        const data = await response.json()
        console.log('Payment token created successfully')

        return data.token
    } catch (error: any) {
        console.error('Payment API Error:', error)
        throw new Error(error.message || 'Failed to initialize payment. Please try again.')
    }
}

// Open Midtrans Snap payment popup
export function openPaymentPopup(
    token: string,
    onSuccess: (result: PaymentResult) => void,
    onPending: (result: PaymentResult) => void,
    onError: (result: PaymentResult) => void
): void {
    if (!window.snap) {
        throw new Error('Midtrans Snap not loaded. Please refresh the page.')
    }

    window.snap.pay(token, {
        onSuccess: (result) => {
            console.log('Payment success:', result)
            onSuccess(result)
        },
        onPending: (result) => {
            console.log('Payment pending:', result)
            onPending(result)
        },
        onError: (result) => {
            console.error('Payment error:', result)
            onError(result)
        },
        onClose: () => {
            console.log('Payment popup closed by user')
        }
    })
}
