# Hedera Account Setup and Environment Configuration

This repository contains the basic setup guide and code samples to configure your environment and create accounts on the **Hedera Hashgraph** network. It demonstrates how to set up a local development environment, connect to Hedera Testnet, and perform account operations.

## Project Structure

hedera-account-setup/
│
├── index.js # Example script to create an account
├── .env # Environment variables (excluded in .gitignore)
├── .gitignore
└── README.md # Project documentation

## Features

- Setup environment for Hedera development
- Connect to Hedera Testnet
- Create a new Hedera account programmatically
- Basic transaction signing and submission

## Technologies

- Hedera JavaScript SDK
- Node.js / Java / Python
- dotenv (for environment variable management)

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/hedera-account-setup.git
cd hedera-account-setup

2. Install Dependencies
For Node.js:
npm install

3. Setup Environment Variables
Create a .env file in the project root:
OPERATOR_ID=your-hedera-account-id
OPERATOR_KEY=your-private-key
HEDERA_NETWORK=testnet

4. Run Account Creation Script
node index.js

🌐 Resources
Hedera Developer Docs
Hedera SDK GitHub

🙋‍♀️ Author
Binari Dissanayake
