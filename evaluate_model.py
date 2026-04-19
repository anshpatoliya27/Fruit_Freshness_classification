import os
import json
import zipfile
import tempfile
import shutil
import numpy as np
from PIL import Image
import time

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# Fix: Patch the .keras file to remove quantization_config before loading
print("Patching model for Keras compatibility...")
model_path = 'Backend/model/fruit_model.keras'
patched_path = 'Backend/model/fruit_model_patched.keras'

# .keras files are ZIP archives with config.json and model.weights.h5
with zipfile.ZipFile(model_path, 'r') as zin:
    with zipfile.ZipFile(patched_path, 'w') as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename == 'config.json':
                config = json.loads(data)
                # Remove quantization_config recursively
                def remove_quant_config(obj):
                    if isinstance(obj, dict):
                        obj.pop('quantization_config', None)
                        for v in obj.values():
                            remove_quant_config(v)
                    elif isinstance(obj, list):
                        for v in obj:
                            remove_quant_config(v)
                remove_quant_config(config)
                data = json.dumps(config).encode('utf-8')
                print("  Removed quantization_config from config.json")
            zout.writestr(item, data)

print("Loading patched model...")
import tensorflow as tf
model = tf.keras.models.load_model(patched_path, compile=False)

# Clean up patched file
os.remove(patched_path)

# Print model summary
print("\n" + "=" * 60)
print("MODEL ARCHITECTURE")
print("=" * 60)
model.summary()

print(f"\nInput shape: {model.input_shape}")
print(f"Output shape: {model.output_shape}")
print(f"Total parameters: {model.count_params()}")

# Get layer names
print(f"\nModel layers: {[l.name for l in model.layers]}")

# Class labels as defined in app.py
class_names = [
    'Apple_fresh', 'Apple_rotten',
    'Banana_fresh', 'Banana_rotten',
    'Dragon_fresh', 'Dragon_rotten',
    'Grapes_fresh', 'Grapes_rotten',
    'Kiwi_fresh', 'Kiwi_rotten',
    'Peaches_fresh', 'Peaches_rotten',
    'Strawberry_fresh', 'Strawberry_rotten',
    'oranges_fresh', 'oranges_rotten',
    'pomegranate_fresh', 'pomegranate_rotten'
]

dataset_dir = 'Fruit Freshness Dataset'

# Map folder structure to class indices
folder_to_class = {}
fruits = sorted([f for f in os.listdir(dataset_dir) if os.path.isdir(os.path.join(dataset_dir, f))])

for fruit in fruits:
    for cond in ['Fresh', 'Rotten']:
        key = f"{fruit}_{cond.lower()}"
        if key in class_names:
            folder_to_class[(fruit, cond)] = class_names.index(key)
        else:
            print(f"WARNING: {key} not found in class_names!")

print("\n" + "=" * 60)
print("FOLDER -> CLASS INDEX MAPPING")
print("=" * 60)
for (fruit, cond), idx in sorted(folder_to_class.items(), key=lambda x: x[1]):
    print(f"  Index {idx:2d}: {fruit}/{cond} -> {class_names[idx]}")

# Evaluate on ALL images
print("\n" + "=" * 60)
print("EVALUATING MODEL ON FULL DATASET...")
print("(This will take a few minutes)")
print("=" * 60)

class_correct = {i: 0 for i in range(18)}
class_total = {i: 0 for i in range(18)}

fresh_correct = 0
fresh_total = 0
rotten_correct = 0
rotten_total = 0

fruit_correct = {}
fruit_total = {}

total_correct = 0
total_images = 0
errors = 0

# Also track condition-level accuracy (ignoring specific fruit)
# i.e., fresh predicted as ANY fresh, rotten as ANY rotten
condition_correct = 0

start_time = time.time()

for fruit in fruits:
    fruit_correct[fruit] = 0
    fruit_total[fruit] = 0
    
    for cond in ['Fresh', 'Rotten']:
        cond_path = os.path.join(dataset_dir, fruit, cond)
        if not os.path.isdir(cond_path):
            continue
        
        true_class = folder_to_class.get((fruit, cond))
        if true_class is None:
            continue
        
        images = [f for f in os.listdir(cond_path) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.bmp'))]
        
        batch_size = 32
        for batch_start in range(0, len(images), batch_size):
            batch_imgs = images[batch_start:batch_start + batch_size]
            batch_arrays = []
            
            for img_name in batch_imgs:
                img_path = os.path.join(cond_path, img_name)
                try:
                    image = Image.open(img_path).convert("RGB").resize((224, 224))
                    image_arr = np.array(image) / 255.0
                    batch_arrays.append(image_arr)
                except Exception as e:
                    errors += 1
            
            if not batch_arrays:
                continue
            
            batch_np = np.array(batch_arrays)
            predictions = model.predict(batch_np, verbose=0)
            pred_classes = np.argmax(predictions, axis=1)
            
            for pred_class in pred_classes:
                total_images += 1
                class_total[true_class] += 1
                fruit_total[fruit] += 1
                
                if cond == 'Fresh':
                    fresh_total += 1
                else:
                    rotten_total += 1
                
                # Exact class match
                if pred_class == true_class:
                    total_correct += 1
                    class_correct[true_class] += 1
                    fruit_correct[fruit] += 1
                    if cond == 'Fresh':
                        fresh_correct += 1
                    else:
                        rotten_correct += 1
                
                # Condition-level match (fresh predicted as any fresh, rotten as any rotten)
                pred_name = class_names[pred_class]
                pred_cond = pred_name.split('_')[-1]
                if (cond == 'Fresh' and pred_cond == 'fresh') or (cond == 'Rotten' and pred_cond == 'rotten'):
                    condition_correct += 1
        
        acc = class_correct[true_class] / class_total[true_class] * 100 if class_total[true_class] > 0 else 0
        print(f"  {fruit}/{cond}: {class_correct[true_class]}/{class_total[true_class]} correct ({acc:.1f}%)")

elapsed = time.time() - start_time

# Print results
print("\n" + "=" * 60)
print("FINAL RESULTS")
print("=" * 60)

print(f"\nTime taken: {elapsed:.1f} seconds")
print(f"Errors (corrupted images skipped): {errors}")

overall_acc = total_correct / total_images * 100 if total_images > 0 else 0
condition_acc = condition_correct / total_images * 100 if total_images > 0 else 0
print(f"\n--- OVERALL ACCURACY (exact 18-class match) ---")
print(f"  {total_correct}/{total_images} = {overall_acc:.2f}%")

print(f"\n--- CONDITION-LEVEL ACCURACY (fresh vs rotten, ignoring fruit) ---")
print(f"  {condition_correct}/{total_images} = {condition_acc:.2f}%")

fresh_acc = fresh_correct / fresh_total * 100 if fresh_total > 0 else 0
rotten_acc = rotten_correct / rotten_total * 100 if rotten_total > 0 else 0
print(f"\n--- FRESH vs ROTTEN ACCURACY (exact match) ---")
print(f"  Fresh:  {fresh_correct}/{fresh_total} = {fresh_acc:.2f}%")
print(f"  Rotten: {rotten_correct}/{rotten_total} = {rotten_acc:.2f}%")

print(f"\n--- PER-FRUIT ACCURACY ---")
for fruit in fruits:
    if fruit_total[fruit] > 0:
        acc = fruit_correct[fruit] / fruit_total[fruit] * 100
        print(f"  {fruit:15s}: {fruit_correct[fruit]:4d}/{fruit_total[fruit]:4d} = {acc:.2f}%")

print(f"\n--- PER-CLASS ACCURACY (all 18 classes) ---")
for i in range(18):
    if class_total[i] > 0:
        acc = class_correct[i] / class_total[i] * 100
        print(f"  {class_names[i]:25s}: {class_correct[i]:4d}/{class_total[i]:4d} = {acc:.2f}%")
    else:
        print(f"  {class_names[i]:25s}: NO DATA")

print("\n" + "=" * 60)
print("SUMMARY")
print("=" * 60)
print(f"  Total images evaluated: {total_images}")
print(f"  Overall accuracy (18-class): {overall_acc:.2f}%")
print(f"  Condition accuracy (fresh/rotten): {condition_acc:.2f}%")
print(f"  Fresh class accuracy: {fresh_acc:.2f}%")
print(f"  Rotten class accuracy: {rotten_acc:.2f}%")
print(f"  Number of fruits: {len(fruits)}")
print(f"  Number of classes: 18")
print(f"  Model file size: {os.path.getsize(model_path) / (1024*1024):.1f} MB")
print("=" * 60)
