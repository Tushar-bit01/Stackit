import pandas as pd
import re
import joblib
import ast
import time
import threading
from collections import Counter
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.multiclass import OneVsRestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MultiLabelBinarizer

# -------------------
# Utility Functions
# -------------------
def clean_text(text):
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    return text.lower()

def safe_eval(x):
    try:
        if isinstance(x, str) and x.strip().startswith("[") and x.strip().endswith("]"):
            return ast.literal_eval(x)
        elif isinstance(x, str):
            return x.split()
        else:
            return x
    except:
        return []

def start_heartbeat():
    def print_heartbeat():
        while True:
            print("🛠 Training in progress...")
            time.sleep(30)
    threading.Thread(target=print_heartbeat, daemon=True).start()

# -------------------
# Data Loading & Cleaning
# -------------------
print("Loading data...")
df = pd.read_csv("datafiles/questions.csv")
df['text'] = df['questions'].apply(clean_text)
df['tags'] = df['tags'].apply(safe_eval)

# -------------------
# Tag Filtering
# -------------------
tag_counts = Counter(tag for tags in df['tags'] for tag in tags)
allowed_tags = {tag for tag, count in tag_counts.items() if count >= 5}

df['tags'] = df['tags'].apply(lambda tags: [tag for tag in tags if tag in allowed_tags])
df = df[df['tags'].map(len) > 0]

print("Cleaned dataset")
print("Remaining rows:", len(df))
print("Unique tags after filtering:", len(allowed_tags))

# -------------------
# Vectorization
# -------------------
print("Vectorizing text and tags...")
mlb = MultiLabelBinarizer(sparse_output=True)
Y = mlb.fit_transform(df['tags'])

tfidf = TfidfVectorizer(max_features=10000)
X = tfidf.fit_transform(df['text'])

X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size=0.2)

# -------------------
# Model Training
# -------------------
print("Starting model training...")

start_heartbeat()  # Start the heartbeat in background

start_time = time.time()

model = OneVsRestClassifier(
    LogisticRegression(max_iter=1000),
    n_jobs=-1
)
model.fit(X_train, y_train)

end_time = time.time()

print("Training complete!")
print(f"Total training time: {end_time - start_time:.2f} seconds")

# -------------------
# Save Artifacts
# -------------------
joblib.dump(model, "models/tag_model.pkl")
joblib.dump(tfidf, "models/tfidf.pkl")
joblib.dump(mlb, "models/mlb.pkl")

print("Model and transformers saved.")
