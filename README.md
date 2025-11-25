# The Typewriter Times

A beautiful, vintage-inspired typing test application that presents typing practice in the style of an old newspaper. Test your typing speed and accuracy while interacting with a classic, newspaper-themed interface.

![The Typewriter Times](public/logo.svg)

## ✨ Features

### 📊 Real-Time Statistics

- **WPM (Words Per Minute)**: Live calculation of your typing speed
- **Accuracy Tracking**: Precise measurement of typing accuracy percentage
- **Active Time Monitoring**: Tracks only active typing time (pauses after 5 seconds of inactivity)

### ⌨️ Typing Experience

- **Blinking Cursor**: Smooth, animated cursor effect for current letter position
- **Visual Feedback**:
  - Correctly typed letters appear in black
  - Incorrect letters are highlighted in red
  - Untyped text shown in gray
  - Extra characters beyond word length shown with red background
- **Focus Management**:
  - Auto-focus on page load
  - Blur effect when not focused
  - Click overlay or press any key to refocus
  - Global keyboard listener for seamless refocus

### 📰 Newspaper Aesthetic

- **Old English Title Font**: Classic newspaper masthead style
- **Helvetica Headers**: Clean, readable statistics display
- **Two-Column Layout**: Authentic newspaper reading experience with justified text

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Bun or npm package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd typewriter
```

2. Install dependencies:

```bash
npm install
# or
bun install
```

3. Start the development server:

```bash
npm run dev
# or
bun run dev
```

4. Open your browser and navigate to the local development URL (typically `http://localhost:5173`)

### Build for Production

```bash
npm run build
# or
bun run build
```

## 🎮 How to Use

1. **Start Typing**: The application automatically focuses on load. Just start typing!
2. **Match the Text**: Type the words exactly as shown in the newspaper content
3. **Use Space or Enter**: Submit each word with the space bar or Enter key
4. **Watch Your Stats**: Monitor your WPM and accuracy in the header as you type
5. **Correct Mistakes**: Use backspace to fix errors before submitting a word

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and development server

## 🎯 Key Features Explained

### WPM Calculation

- Only counts correctly typed characters
- Calculates based on active typing time (excludes pauses over 5 seconds)
- Formula: `(totalCharsTyped / 5) / (activeTime / 60)`

### Accuracy Tracking

- Tracks total characters typed and total errors
- Formula: `((totalCharsTyped - totalErrors) / totalCharsTyped) * 100`
- Starts at 100% and updates in real-time

---

**Happy Typing!** 📰⌨️
