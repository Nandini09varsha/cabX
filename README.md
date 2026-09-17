# CabX

CabX is a Solana-backed ride-hailing prototype. Riders lock a token fare in an
escrow vault; verified drivers accept and complete the ride; the on-chain
program releases the fare to the driver. The React client talks only to the
Express API, which creates transactions for the connected wallet to sign.

## Project flow

```text
Rider / Driver browser (React + Vite)
        │ JWT API calls and wallet signatures
        ▼
Express API (MongoDB records, authorization, transaction builders)
        │ Anchor / Solana RPC
        ▼
ride_hailing Anchor program (PDAs, stake vault, fare escrow, lifecycle)
```

1. A user registers, logs in, and connects a Solana wallet and token account.
2. A driver registers a vehicle and stakes tokens. An admin verifies the
   driver on-chain.
3. A rider requests a ride. The wallet signs the `request_ride` transaction,
   which locks the fare in the ride escrow account.
4. A verified online driver accepts, starts, then completes the ride by
   signing each transaction. Completion transfers escrowed tokens to the
   driver's token account.
5. The API records confirmations, payments, ratings, and the MongoDB view of
   the lifecycle. The client displays that API data and the on-chain state.

The intended status sequence is `requested → accepted → in_progress →
completed`. A requested ride can instead be cancelled and the rider refunded.
GPS/oracle location updates are deliberately not part of the tested workflow
yet.

## Requirements

- Node.js 20+ and npm
- Rust, Solana CLI, and Anchor CLI
- MongoDB (locally or via a connection string)
- A local Solana validator for the end-to-end test

## Setup

Install dependencies:

```bash
cd frontend && npm install
cd ../backend && npm install
cd ../smart_contracts && npm install
```

Create `backend/.env` from `backend/env.example`. For local development set:

```dotenv
MONGO_URI=mongodb://127.0.0.1:27017/cabx
JWT_SECRET=use-a-long-random-secret
SOLANA_RPC_URL=http://127.0.0.1:8899
PROGRAM_ID=<program-id-after-anchor-deploy>
PAYMENT_MINT=<local-SPL-token-mint>
ADMIN_SECRET_KEY=<JSON-array-for-the-local-admin-keypair>
CORS_ORIGIN=http://localhost:5173
```

For the browser, optionally create `frontend/.env`:

```dotenv
VITE_API_URL=http://127.0.0.1:5000/api
VITE_SOLANA_RPC_URL=http://127.0.0.1:8899
```

Start MongoDB, then in separate terminals:

```bash
# terminal 1
solana-test-validator --reset

# terminal 2: build/deploy the Anchor program and copy its program id to backend/.env
cd smart_contracts && anchor build && anchor deploy

# terminal 3
cd backend && npm run dev

# terminal 4
cd frontend && npm run dev
```

Open the Vite URL (normally `http://localhost:5173`) and connect a wallet
configured for the same local validator. Use funded local wallets and token
accounts for the configured payment mint.

## Rider guide

1. Register with the **rider** role, then sign in.
2. Connect the wallet and link its payment-token account.
3. Choose pickup, destination, ride type, and fare on **Book Ride**.
4. Approve the wallet transaction to lock the fare in escrow.
5. Follow the ride in **Current Ride**. After the driver completes it, submit
   a rating in the ride details/history view.

## Driver guide

1. Register with the **driver** role, then sign in and link a funded wallet.
2. Complete **Register Driver** with vehicle details and approve the stake
   transaction.
3. Have an admin verify the driver. Until verification, rides cannot be
   accepted.
4. Set availability online, choose a request, and sign **accept**.
5. Sign **start** and then **complete**. Completion transfers the rider's
   escrowed fare to the linked driver token account; view it in **Earnings**.

## Checks and tests

```bash
npm run typecheck --prefix frontend
npm run build --prefix frontend
npm run typecheck --prefix backend
npm run lint --prefix smart_contracts
cd smart_contracts && anchor test
```

With MongoDB, the API, a deployed local program, a payment mint, and the
environment values above running, execute the end-to-end ride lifecycle:

```bash
cd backend && npm run e2e
```

It verifies registration, wallet linking, driver staking and verification,
availability, fare escrow, acceptance, start, completion, payments, earnings,
ratings, and final on-chain status. It intentionally does not invoke GPS or
oracle routes.
