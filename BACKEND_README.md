# MAISALON - Express Backend Setup

## Files Created:
- `server.js` - Express backend for Midtrans payment processing

## How to Run:

### 1. Update .env.local with your Midtrans Server Key:
```
MIDTRANS_SERVER_KEY=SB-Mid-server-YOUR_KEY_HERE
```

### 2. Start both servers:

**Terminal 1** (Frontend):
```bash
npm run dev
```

**Terminal 2** (Backend):
```bash
npm run server
```

### 3. Test Payment:
1. Go to booking wizard
2. Complete all steps
3. Click "Confirm & Pay"
4. Real Midtrans Snap popup will appear! 🎉

## Test Cards (Sandbox):
- **Success:** 4811 1111 1111 1114
- **CVV:** 123
- **Exp:** 01/25

## What's Happening:
1. Frontend calls backend API at `localhost:3001`
2. Backend generates real Midtrans token (with Server Key)
3. Returns token to frontend
4. Frontend opens Midtrans Snap popup
5. User completes payment
6. Booking is confirmed!

## Benefits:
- ✅ Learn Express.js backend
- ✅ Secure Server Key handling
- ✅ Real Midtrans integration
- ✅ Full-stack architecture
