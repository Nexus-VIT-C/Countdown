# Hackathon Timer

![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

A sleek, modern countdown timer specifically designed for hackathons and coding events. This customizable timer helps event organizers and participants track time with style.

## 🚀 Features

- **Multiple Timer Modes**: Choose between duration-based or end-time-based countdown
- **Modern UI/UX**: Sleek design with smooth animations and transitions
- **Enhanced Wheel Input**: Intuitive, smooth wheel input with inertial scrolling for setting time
- **Multiple Display Styles**: Digital, flip animation, analog, and progress circle
- **Theme Support**: Dark/light mode with smooth transitions
- **Fullscreen Mode**: Distraction-free timer experience
- **Layout Options**: Centered, floating, PIP (Picture-in-Picture), or with custom logo
- **Customization**: Upload custom backgrounds and logos
- **Celebration Effects**: Confetti animation when the timer completes
- **Responsive Design**: Works on all screen sizes

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Customized shadcn/ui
- **Animations**: Framer Motion
- **Theme System**: next-themes
- **Special Effects**: react-confetti

## 📋 Prerequisites

- Node.js (v18+)
- npm or yarn

## 🔧 Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Nexus-VIT-C/Countdown.git
   cd hackathon-timer
   ```

2. Install dependencies
   ```bash
   # Note: You need to use legacy-peer-deps due to dependency conflicts
   npm install --legacy-peer-deps
   # OR
   yarn install --legacy-peer-deps
   ```

3. Run the development server
   ```bash
   npm run dev
   # OR
   yarn dev
   ```

4. Build for production
   ```bash
   npm run build
   # OR
   yarn build
   ```

5. Start the production server
   ```bash
   npm start
   # OR
   yarn start
   ```

## ⚠️ Known Issues

- Dependency conflicts between date-fns v4.1.0 and react-day-picker (requiring date-fns v2.28.0 or v3.0.0)
- Some animation glitches may occur during rapid theme switching
- Mobile touch interactions may need further optimization
- PIP mode may have positioning issues on certain browsers

## 📖 Usage Guide

### Basic Usage

1. **Choose Timer Mode**: Select between "Duration" (countdown from a set time) or "End Time" (countdown until a specific time)
2. **Set Time**: Use the wheel inputs to set your desired time
3. **Start Timer**: Click the "Start Timer" button
4. **Control Options**: Use Pause/Resume and Reset buttons as needed

### Customization

- **Theme**: Toggle between dark and light mode with the sun/moon button
- **Timer Style**: Access the settings panel (palette icon) to change:
  - Timer display style (Digital, Flip, Analog, Progress)
  - Layout style (Centered, Floating, PIP, Logo)
  - Custom background
  - Custom logo
  - Text color

### Keyboard Shortcuts

- `F11` or the maximize button for fullscreen mode
- `Esc` to exit fullscreen

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Install dependencies with legacy peer deps (`npm install --legacy-peer-deps`)
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [shadcn/ui](https://ui.shadcn.com/) for the UI components
- [next-themes](https://github.com/pacocoursey/next-themes) for theme management
- [framer-motion](https://www.framer.com/motion/) for animations
- [react-confetti](https://github.com/alampros/react-confetti) for celebration effects

