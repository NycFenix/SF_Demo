This project is a course conclusion project for the Visual Computing course from Universidade Federal do Rio de Janeiro (UFRJ). It describes an iteration of the classic game "Breakout" with a Fruitiger Aero Aesthetic built entirely on P5.js

**Link for Website implementation**: https://nycfenix.github.io/SF_Demo/

## Prerequisites & Dependencies

To view, build, or host this project locally, you need a modern web browser and a local development environment.

### 1. Browser Environment
- Any modern browser supporting **WebGL 1.0 / 2.0** (Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari).

### 2. Required External Libraries
The project depends on the **p5.js** ecosystem. These are loaded via CDN or local directory paths within your HTML structure:
- **p5.js** (Core Library)
- **p5.sound.js** (Optional audio extensions, if referenced by maps)

### 3. Recommended Development Tools
- **Node.js** 
- **Visual Studio Code** with the **Live Server** extension

## 4 How to Build this project

### Method 1: Using VSCode
- Open the project root in VSCode
- Install the **Live Server** VSCode Extension
- Right-click "index.html" file and select "Open With Live Server"

  Your default browser will open the sketch.js at the local adress **http://127.0.0.1:5500/**

### Method 2: Using Node.Js

- Open the project root in a terminal

- Execute the following:
  
```bash
npm install -g http-server

http-server .
```

This installs "http-server" packet and initializes it on current directory

- Now open default browser and access adress shown in terminal (normally **http://localhost:8080**)
