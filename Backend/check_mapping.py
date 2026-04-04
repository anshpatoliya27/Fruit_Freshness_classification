import os
import numpy as np
from PIL import Image
import tensorflow as tf

def check_mapping():
    model = tf.keras.models.load_model('model/fruit_model.keras')
    dataset_dir = '../Fruit Freshness Dataset'
    
    mapping_scores = {i: [] for i in range(18)}
    
    fruits = [f for f in os.listdir(dataset_dir) if os.path.isdir(os.path.join(dataset_dir, f))]
    for fruit in fruits:
        fruit_dir = os.path.join(dataset_dir, fruit)
        for cond in ['Fresh', 'Rotten']:
            cond_dir = os.path.join(fruit_dir, cond)
            if not os.path.isdir(cond_dir):
                continue
            
            # get first image
            imgs = [img for img in os.listdir(cond_dir) if img.lower().endswith(('.png', '.jpg', '.jpeg'))]
            if not imgs:
                continue
            
            # Predict
            img_path = os.path.join(cond_dir, imgs[0])
            try:
                image = Image.open(img_path).convert("RGB").resize((224, 224))
                image_arr = np.array(image) / 255.0
                image_arr = np.expand_dims(image_arr, axis=0)
                
                prediction = model.predict(image_arr, verbose=0)
                pred_idx = np.argmax(prediction)
                
                print(f"Class Index {pred_idx:02d} -> {fruit}_{cond.lower()}")
            except Exception as e:
                print(f"Error on {img_path}: {e}")

if __name__ == '__main__':
    check_mapping()
