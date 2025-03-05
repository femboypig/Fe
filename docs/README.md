# Fe Editor Documentation

## Overview
Fe Editor is a modern, lightweight code editor built with Electron. It features a clean, minimal interface with a focus on performance and user experience.

## Features
- Custom titlebar with window controls
- Resizable sidebar for file explorer
- Modern UI with Zed Mono font
- Light theme optimized for readability
- Responsive layout with flexible components

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/fe-editor.git
cd fe-editor
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Building
To create a production build:
```bash
npm run build
```

## Project Structure
```
fe-editor/
├── src/
│   ├── assets/
│   │   ├── fonts/
│   │   └── icons/
│   ├── main.js
│   ├── preload.js
│   ├── renderer.js
│   ├── index.html
│   └── styles.css
├── docs/
│   └── README.md
└── package.json
```

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details. 