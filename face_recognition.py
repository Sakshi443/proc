import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Suppress info and warnings from TF

import csv
import cv2
import numpy as np
from datetime import datetime
from deepface import DeepFace
import gradio as gr


# Directories
SAVED_DIR = "saved_faces"
RECOGNIZED_DIR = "recognized_faces"
LOG_DIR = "logs"
LOG_FILE = os.path.join(LOG_DIR, "recognition_log.csv")

os.makedirs(SAVED_DIR, exist_ok=True)
os.makedirs(RECOGNIZED_DIR, exist_ok=True)
os.makedirs(LOG_DIR, exist_ok=True)


# In-memory storage
known_faces = {}
matched_images = {}


# Load saved faces at startup
def load_known_faces():
    for filename in os.listdir(SAVED_DIR):
        if filename.endswith((".jpg", ".png", ".jpeg")):
            name = os.path.splitext(filename)[0]
            path = os.path.join(SAVED_DIR, filename)
            img = cv2.imread(path)
            if img is not None:
                known_faces[name] = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)


load_known_faces()


# Add new face
def face_it(image, name):
    if not name:
        return "❌ Please enter a name."
    if image is None:
        return "❌ Invalid image. Try uploading again."

    path = os.path.join(SAVED_DIR, f"{name}.jpg")
    cv2.imwrite(path, cv2.cvtColor(image, cv2.COLOR_RGB2BGR))
    known_faces[name] = image
    return f"✅ Added face for {name}."


# Recognize face
def recognize_face(image, uploader_name):
    if image is None:
        return "❌ Please upload a valid image to recognize."

    if not uploader_name:
        return "❌ Please enter uploader name."

    matched_images.clear()

    for name, known_img in known_faces.items():
        try:
            result = DeepFace.verify(image, known_img, enforce_detection=False)
            if result.get("verified"):
                # Save recognized image
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                rec_path = os.path.join(RECOGNIZED_DIR, f"{name}_{timestamp}.jpg")
                cv2.imwrite(rec_path, cv2.cvtColor(image, cv2.COLOR_RGB2BGR))

                # Log to CSV
                with open(LOG_FILE, mode='a', newline='') as file:
                    writer = csv.writer(file)
                    writer.writerow([uploader_name, name, timestamp, rec_path])

                # Store matched images for viewing
                matched_images[name] = {
                    "saved": known_img,
                    "recognized": image
                }

                return f"✅ Match found: This is {name}"

        except Exception as e:
            print(f"Error verifying with {name}: {e}")
            continue

    return "❌ No match found."


# View matched pairs in grid
def view_faces():
    if not matched_images:
        return "No matched faces yet.", None

    pairs = []
    names = []

    for name, images in matched_images.items():
        saved = cv2.resize(images["saved"], (100, 100))
        recognized = cv2.resize(images["recognized"], (100, 100))
        pair = np.hstack((saved, recognized))
        pairs.append(pair)
        names.append(name)

    grid = np.vstack(pairs) if len(pairs) > 1 else pairs[0]
    return ", ".join(names), grid


# Interface: Add face
add_face = gr.Interface(
    fn=face_it,
    inputs=[gr.Image(label="Upload Face"), gr.Textbox(label="Enter Name")],
    outputs="text",
    title="Add New Face"
)


# Interface: Recognize face
check_face = gr.Interface(
    fn=recognize_face,
    inputs=[gr.Image(label="Upload Face to Recognize"), gr.Textbox(label="Uploader Name")],
    outputs="text",
    title="Recognize Face"
)


# Interface: View matched face pairs
view_faces_interface = gr.Interface(
    fn=view_faces,
    inputs=[],
    outputs=[gr.Textbox(label="Matched Names"), gr.Image(label="Matched Pairs (Saved vs Recognized)")],
    title="View Matched Faces"
)


# Tabbed UI
gr.TabbedInterface(
    [add_face, check_face, view_faces_interface],
    ["Add Face", "Recognize Face", "View Matches"]
).launch()
