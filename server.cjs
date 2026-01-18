const express = require('express')
const cors = require('cors')
const midtransClient = require('midtrans-client')
require('dotenv').config({ path: '.env.local' })

const app = express()
const PORT = 3001

// Middleware
app.use(cors())
app.use(express.json())

// Initialize Midtrans Snap
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Payment server is running' })
})

// Create payment token endpoint
app.post('/api/payment/create-token', async (req, res) => {
  try {
    const { orderId, amount, customerName, customerEmail, itemName } = req.body

    // Validate required fields
    if (!orderId || !amount || !customerEmail) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Prepare transaction details for Midtrans
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount
      },
      customer_details: {
        first_name: customerName || 'Customer',
        email: customerEmail
      },
      item_details: [
        {
          id: orderId,
          name: itemName || 'Salon Service',
          price: amount,
          quantity: 1
        }
      ],
      credit_card: {
        secure: true
      }
    }

    console.log('Creating transaction for order:', orderId)

    // Create transaction with Midtrans
    const transaction = await snap.createTransaction(parameter)
    
    console.log('Transaction created successfully')
    
    res.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url
    })

  } catch (error) {
    console.error('Midtrans API Error:', error)
    res.status(500).json({ 
      error: 'Failed to create payment token',
      message: error.message 
    })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Payment Server running on http://localhost:${PORT}`)
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/payment/create-token\n`)
})
