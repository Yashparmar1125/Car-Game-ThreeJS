# 🏎️ThreeJS Car Game

<div align="center">

** [Report Bug](https://www.google.com/search?q=https://github.com/Yashparmar1125/Car-Game-ThreeJS/issues) • [Request Feature**](https://www.google.com/search?q=https://github.com/Yashparmar1125/Car-Game-ThreeJS/issues)

</div>

---

## 📖 **About The Project**

Welcome to **Drift & Drive**, a high-fidelity 3D racing simulator running directly in your browser. Built with the power of **React Three Fiber** and **Rapier Physics**, this project demonstrates how web technologies can deliver console-quality gaming experiences.

Choose from a fleet of unique vehicles—from heavy-duty tractors to high-speed super diesels—and navigate through a physics-enabled world. Whether you're a developer looking to learn 3D web game dev or a player wanting a quick drive, this project has something for you.

---

## ✨ **Key Features**

| Feature | Description |
| --- | --- |
| **🏎️ Realistic Physics** | Powered by **Rapier**, experience true-to-life suspension, friction, and collision dynamics. |
| **🚙 Diverse Fleet** | Drive 6+ unique vehicles including **Monster Trucks**, **Snowmobiles**, and **F1 Racers**, each with unique handling. |
| **🌍 Dynamic Environment** | Infinite terrain rendering with high-quality PBR textures (Roughness & Normal maps). |
| **🎮 Smooth Controls** | Responsive keyboard input handling with **Zustand** state management for 60FPS performance. |
| **🎥 Cinematic Camera** | A smart camera system that follows your vehicle's momentum and drift. |
| **⚡ Instant Load** | Optimized with **Vite** and GLTF compression for near-instant startup times. |

---

## 🎮 **How to Play**

Take control of your vehicle using your keyboard. Master the physics to clear checkpoints and set high scores!

<div align="center">

| Action | Key 1 | Key 2 |
| --- | --- | --- |
| **Accelerate** | <kbd>W</kbd> | <kbd>↑</kbd> |
| **Brake / Reverse** | <kbd>S</kbd> | <kbd>↓</kbd> |
| **Steer Left** | <kbd>A</kbd> | <kbd>←</kbd> |
| **Steer Right** | <kbd>D</kbd> | <kbd>→</kbd> |
| **Reset Car** | <kbd>R</kbd> | *(Flip back upright)* |

</div>

---

## 🛠️ **Under the Hood**

This project is a showcase of the modern React 3D ecosystem.

### **Core Stack**

* **Engine:** [React Three Fiber (R3F)](https://docs.pmnd.rs/react-three-fiber) - The React renderer for Three.js.
* **Physics:** [React Three Rapier](https://github.com/pmndrs/react-three-rapier) - Fast, deterministic physics simulation.
* **State:** [Zustand](https://github.com/pmndrs/zustand) - Transient state updates (no re-renders on every frame!).
* **Assets:** [React Three Drei](https://github.com/pmndrs/drei) - Helpers for environments, controls, and loading.

### **Project Structure**

```bash
Car-Game-ThreeJS/
├── 📂 public/
│   ├── 📂 vehicals/        # 🚗 GLB Models (Hill Climber, Tractor, etc.)
│   └── 🛣️ Textures         # PBR Road maps (Diffuse, Normal, Roughness)
├── 📂 src/
│   ├── 📂 components/
│   │   ├── 🏎️ Car.jsx      # Vehicle controller & physics body
│   │   ├── 🏁 Scene.jsx    # Lights, Environment & Ground
│   │   ├── 🚧 UI.jsx       # Heads-Up Display (Speed, Controls)
│   │   └── 🧩 Experience.jsx # Main 3D Composition
│   ├── ⚛️ App.jsx          # Root Component & Canvas Setup
│   └── 🎨 index.css        # Global Styles
└── ⚙️ package.json         # Dependencies

```

---

## 🚀 **Getting Started**

Follow these simple steps to get a local copy up and running.

### **Prerequisites**

* **Node.js** (v16.0.0 or higher)
* **npm** or **yarn**

### **Installation**

1. **Clone the repository**
```sh
git clone https://github.com/Yashparmar1125/Car-Game-ThreeJS.git

```


2. **Navigate to the directory**
```sh
cd Car-Game-ThreeJS

```


3. **Install dependencies**
```sh
npm install
# or
yarn install

```


4. **Start the development server**
```sh
npm run dev

```


5. Open your browser to `http://localhost:5173` and start your engines!

---

## 🛣️ **Roadmap**

* [ ] 📱 **Mobile Controls:** Touchscreen joystick support.
* [ ] 🔊 **Audio System:** Engine sounds and tire screeching effects.
* [ ] 🏆 **Leaderboard:** Save high scores using Firebase.
* [ ] 🏎️ **Vehicle Customization:** Change colors and wheel types.

---

## 🤝 **Contributing**

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 **Author**

**Yash Parmar**

* 🌐 **GitHub:** [@Yashparmar1125](https://github.com/Yashparmar1125)
* 💼 **LinkedIn:** [Yash Parmar](https://linkedin.com/in/yashparmar1125)

---

<div align="center">

**Star 🌟 this repo if you find it cool!**

</div>
