# Compiler Engine Visualizer: Infix to Postfix

A hybrid, full-stack application that bridges a native C++ mathematical parser with a modern Next.js web interface to visualize the Shunting Yard algorithm in real-time.

## 🏗️ Architecture

This project deliberately avoids traditional Node/Express backend architectures to demonstrate cross-language process execution and telemetry streaming.

* **The Engine (C++11):** A custom-built Lexical Analyzer and Evaluator. It tokenizes mathematical strings, applies the Shunting Yard algorithm to handle operator precedence, and computes the result.
* **The Telemetry Bridge:** Instead of a "black box" output, the C++ engine uses a custom CLI wrapper to broadcast its internal stack and queue states at every iteration loop, formatting them as a strictly structured JSON payload.
* **The Web Client (Next.js / TypeScript):** A unified App Router application. The server-side API securely spawns the compiled C++ binary using Node's `child_process`, captures the standard output, and pipes the data to a React UI that acts as a DVR—allowing users to step through the algorithm frame-by-frame.

## 🚀 Getting Started (Local Development)

### Prerequisites

* `g++` compiler (GCC)
* `Node.js` (v18+)
* `pnpm`

### 1. Compile the C++ Engine

Navigate to the engine directory and compile the CLI wrapper:
\`\`\`bash
cd engine
g++ -o engine_cli cli.cpp -std=c++11
\`\`\`

### 2. Boot the Next.js Client

Navigate to the frontend directory, install dependencies, and run the server:
\`\`\`bash
cd ../frontend
pnpm install
pnpm dev
\`\`\`

Open `http://localhost:3000` to interact with the visualizer.

## 🧠 Core Concepts Demonstrated

* **Data Structures:** Advanced implementation of Stacks and Queues.
* **Memory Safety:** Native C++ vector management.
* **System Integration:** IPC (Inter-Process Communication) bridging native OS binaries with web servers.
* **State Management:** Complex React state orchestration to parse and animate 2D telemetry arrays over time.
