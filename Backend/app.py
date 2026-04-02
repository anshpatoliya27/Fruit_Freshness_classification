from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from PIL import Image
import tensorflow as tf

app = Flask(__name__)
CORS(app)

# Load model
model = tf.keras.models.load_model("model/fruit_model.keras")

# Class labels (IMPORTANT)
class_names = [
    'Apple_fresh', 'Apple_rotten',
    'Banana_fresh', 'Banana_rotten',
    'Grapes_fresh', 'Grapes_rotten',
    'Kiwi_fresh', 'Kiwi_rotten',
    'Peaches_fresh', 'Peaches_rotten',
    'Strawberry_fresh', 'Strawberry_rotten',
    'oranges_fresh', 'oranges_rotten',
    'pomegranate_fresh', 'pomegranate_rotten',
    'Dragon_fresh', 'Dragon_rotten'
]

# Image preprocess
def preprocess_image(image):
    image = image.resize((224, 224))
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)
    return image

# Prediction route
@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"})

    file = request.files["file"]
    image = Image.open(file).convert("RGB")

    processed = preprocess_image(image)
    prediction = model.predict(processed)

    predicted_class = class_names[np.argmax(prediction)]

    # Format output
    fruit, condition = predicted_class.split("_")

    if condition == "fresh":
        result = f"Fresh {fruit} 🍎"
    else:
        result = f"Rotten {fruit} ❌"

    return jsonify({"result": result})


if __name__ == "__main__":
    app.run(debug=True)