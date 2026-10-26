# 🌱 KrishiSense AI

**AI-powered crop recommendation for smarter agricultural decisions.**

KrishiSense AI is a machine learning-powered web application that recommends suitable crops based on soil nutrients and environmental conditions. It combines a React frontend with a FastAPI backend to deliver predictions from a trained Random Forest classification model.

## ✨ Features

- 🌾 **Crop Recommendation:** Recommends crops using nitrogen, phosphorus, potassium, temperature, humidity, soil pH, and rainfall.
- 🤖 **Machine Learning:** Uses a trained Random Forest classifier.
- 📊 **Top Crop Suggestions:** Displays the top three model recommendations and their scores.
- ⚡ **REST API:** Connects the frontend to a Python FastAPI backend.
- 📱 **Interactive Dashboard:** Provides a user-friendly interface for entering agricultural data.
- 🔬 **Model Evaluation:** Reports held-out test-set accuracy.
- 🚧 **Yield Prediction:** Planned feature; a trained yield prediction model is not yet available.

## 🛠️ Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- Lucide React

**Backend**
- Python
- FastAPI
- scikit-learn
- pandas
- Joblib

## 🧠 Machine Learning Model

The crop recommendation model is trained using the crop recommendation dataset, which contains soil nutrient and environmental features.

**Input features**
- Nitrogen (N)
- Phosphorus (P)
- Potassium (K)
- Temperature
- Humidity
- Soil pH
- Rainfall

**Model:** Random Forest Classifier

**Held-out test accuracy:** 99.32%

This accuracy was measured on a held-out test split. It does not guarantee the same performance on new locations or real-world farms. The displayed model scores are not probabilities of crop success.

## 📁 Project Structure

```text
KrishiSenseAI/
├── backend/
│   ├── data/
│   │   └── Crop_recommendation.csv
│   ├── models/
│   │   └── crop_recommendation_model.joblib
│   ├── main.py
│   └── train_crop_model.py
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Python 3.10 or a compatible version
- Node.js and npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Vidyashreegsm/KrishiSenseAI.git
cd KrishiSenseAI
```

### 2. Set up the backend

Open a terminal in the project root.

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install fastapi "uvicorn[standard]" pandas scikit-learn joblib
```

Start the API:

```powershell
python -m uvicorn main:app --reload
```

Backend API: `http://127.0.0.1:8000`

Interactive API documentation: `http://127.0.0.1:8000/docs`

### 3. Set up the frontend

Open a second terminal from the project root:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

### 4. Check backend health

Visit:

`http://127.0.0.1:8000/api/health`

The crop recommendation model should report that it is trained and loaded.

## 🔌 API Endpoint

### `POST /api/crops/recommend`

Example request:

```json
{
  "N": 90,
  "P": 42,
  "K": 43,
  "temperature": 20.88,
  "humidity": 82.0,
  "ph": 6.5,
  "rainfall": 202.9
}
```

The API returns the recommended crop, top recommendations, model information, and a notice about the limitations of dataset-based predictions.

## 🗺️ Roadmap

- [x] Train a crop recommendation classifier
- [x] Build the FastAPI recommendation endpoint
- [x] Connect the React frontend to the backend
- [x] Display crop recommendations in the dashboard
- [ ] Train and evaluate a crop yield prediction model
- [ ] Integrate verified historical agricultural data
- [ ] Improve recommendations using region-specific data
- [ ] Deploy the frontend and backend
- [ ] Add testing and model evaluation reports

## ⚠️ Disclaimer

KrishiSense AI is an educational and decision-support project. Its recommendations reflect patterns in the training dataset and should not be treated as guaranteed agricultural advice. Validate recommendations against local soil tests, weather, water availability, regional agricultural guidance, and expert advice before making farming decisions.

## 👩‍💻 Author

**Vidya Shree G S**

- GitHub: [@Vidyashreegsm](https://github.com/Vidyashreegsm)

---

⭐ If you find this project interesting, consider starring the repository!
