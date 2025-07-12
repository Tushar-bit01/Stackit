import joblib
import re
from flask import request,jsonify


# Load model and vectorizers
model = joblib.load("models/tag_model.pkl")
tfidf = joblib.load("models/tfidf.pkl")
mlb = joblib.load("models/mlb.pkl")


# Text cleaner (same as training)
def clean_text(text):
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    return text.lower()


def predict_tags():
    data = request.get_json()

    title = data.get('title', '')
    desc = data.get('description', '')
    
    if not title and not desc:
        return jsonify({'error': 'Missing title or description'}), 400

    # Combine and clean
    combined_text = clean_text(title + " " + desc)
    print("🧹 Cleaned input:", combined_text)

    # Vectorize
    vectorized = tfidf.transform([combined_text])
    probabilities = model.predict_proba(vectorized)

    # 🔍 Debug: show top tag probabilities
    probs = probabilities[0].flatten()  # <-- Fixed line
    top_indices = probs.argsort()[-10:][::-1]
    top_tags = [(mlb.classes_[i], round(probs[i], 4)) for i in top_indices]
    print("🔍 Top tag probabilities:", top_tags)

    # Thresholding
    threshold = 0.1
    predicted = (probs >= threshold).astype(int).reshape(1, -1)

    predicted_tags = mlb.inverse_transform(predicted)[0]
    print("✅ Final predicted tags:", predicted_tags if predicted_tags else "No tags predicted.")

    return jsonify({'tags': predicted_tags})



