# HASH Club Achievement NFTs

This is a Next.js application that interacts with a smart contract on the blockchain to allow users to mint achievement NFTs based on their HASH earnings.

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework for building user interfaces.
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
- [TypeScript](https://www.typescriptlang.org/) - A typed superset of JavaScript that compiles to plain JavaScript.
- [Thirdweb](https://thirdweb.com/) - A platform for building web3 applications.
- [Ethers.js](https://ethers.io/) - A complete and compact library for interacting with the Ethereum Blockchain and its ecosystem.
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapid UI development.

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

- Node.js (v18.x or later)
- npm, yarn, or pnpm

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username/your_project_name.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create a `.env.local` file in the root of the project and add your Thirdweb client ID:
    ```
    NEXT_PUBLIC_TW_CLIENT_ID=your_client_id
    ```

### Running the Application

To run the application in a development environment, use the following command:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app/`: This directory contains the main application files.
  - `src/app/page.tsx`: The main page of the application.
  - `src/app/layout.tsx`: The main layout of the application.
  - `src/app/globals.css`: Global styles for the application.
  - `src/app/abi.ts`: The ABI for the smart contract.
  - `src/app/chain.ts`: The blockchain configuration.
  - `src/app/client.ts`: The Thirdweb client configuration.
  - `src/app/contract.ts`: The smart contract instance.
  - `src/app/components/`: This directory contains the React components.
    - `src/app/components/NftMinter.tsx`: The main component for minting NFTs.
- `public/`: This directory contains static assets.
- `utils/`: This directory contains utility functions.
  - `utils/contracts.ts`: This file contains the smart contract address.

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in the development mode.
- `npm run build`: Builds the app for production to the `.next` folder.
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the project files.