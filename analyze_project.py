import os
import json

dataset_dir = 'Fruit Freshness Dataset'

results = {}
grand_total = 0
fresh_total = 0
rotten_total = 0

fruits = sorted([f for f in os.listdir(dataset_dir) if os.path.isdir(os.path.join(dataset_dir, f))])

print("=" * 60)
print("DATASET IMAGE COUNT ANALYSIS")
print("=" * 60)

for fruit in fruits:
    fruit_path = os.path.join(dataset_dir, fruit)
    results[fruit] = {}
    
    for cond in ['Fresh', 'Rotten']:
        cond_path = os.path.join(fruit_path, cond)
        if os.path.isdir(cond_path):
            images = [f for f in os.listdir(cond_path) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.bmp'))]
            count = len(images)
            results[fruit][cond] = count
            grand_total += count
            if cond == 'Fresh':
                fresh_total += count
            else:
                rotten_total += count
            print(f"  {fruit}/{cond}: {count} images")
        else:
            print(f"  {fruit}/{cond}: MISSING")
    
    fruit_total = sum(results[fruit].values())
    print(f"  --> {fruit} Total: {fruit_total}")
    print()

print("=" * 60)
print(f"TOTAL FRESH images: {fresh_total}")
print(f"TOTAL ROTTEN images: {rotten_total}")
print(f"GRAND TOTAL images: {grand_total}")
print(f"Number of fruits: {len(fruits)}")
print(f"Number of classes: {len(fruits) * 2}")
print(f"Fruits: {', '.join(fruits)}")
print("=" * 60)

# Check for train/test/val splits
print("\nChecking for train/test/val split folders...")
for fruit in fruits:
    fruit_path = os.path.join(dataset_dir, fruit)
    for cond in ['Fresh', 'Rotten']:
        cond_path = os.path.join(fruit_path, cond)
        if os.path.isdir(cond_path):
            subdirs = [d for d in os.listdir(cond_path) if os.path.isdir(os.path.join(cond_path, d))]
            if subdirs:
                print(f"  {fruit}/{cond} has subdirectories: {subdirs}")

# Also check top-level for train/test/val
top_level_items = os.listdir(dataset_dir)
print(f"\nTop-level items in dataset: {top_level_items}")

# Check if there are separate train/test/val directories at root
for split_name in ['train', 'test', 'val', 'validation', 'Train', 'Test', 'Val', 'Validation']:
    split_path = os.path.join(dataset_dir, split_name)
    if os.path.isdir(split_path):
        print(f"  Found split directory: {split_name}")
