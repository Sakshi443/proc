import cv2
import mediapipe as mp
import math
import time
from datetime import datetime

# Initialize FaceMesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=False,
    max_num_faces=5,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

mp_drawing = mp.solutions.drawing_utils
drawing_spec = mp_drawing.DrawingSpec(thickness=1, circle_radius=1)

cap = cv2.VideoCapture(0)

# Timers and baseline
look_away_start = None
face_missing_start = None
ALERT_LOOK_AWAY_SECS = 3
ALERT_NO_FACE_SECS = 2
SAVE_SCREENSHOTS = True

baseline_nose_x = None
baseline_nose_y = None

# GUI Button
BUTTON_X1, BUTTON_Y1 = 20, 60
BUTTON_X2, BUTTON_Y2 = 220, 100

def calculate_angle(left, right):
    dx = right[0] - left[0]
    dy = right[1] - left[1]
    return math.degrees(math.atan2(dy, dx))

def save_screenshot(frame, reason):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{reason}_{timestamp}.jpg"
    cv2.imwrite(filename, frame)

def draw_button(image, text):
    cv2.rectangle(image, (BUTTON_X1, BUTTON_Y1), (BUTTON_X2, BUTTON_Y2), (50, 50, 255), -1)
    cv2.putText(image, text, (BUTTON_X1 + 10, BUTTON_Y1 + 25), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

while cap.isOpened():
    success, image = cap.read()
    if not success:
        continue

    h, w, _ = image.shape
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(image_rgb)
    now = time.time()

    alert = False
    status = ""
    color = (0, 255, 0)

    mouse_click = cv2.getWindowProperty("Proctoring", cv2.WND_PROP_VISIBLE) >= 1

    if results.multi_face_landmarks:
        num_faces = len(results.multi_face_landmarks)

        if num_faces > 1:
            status = f"🚨 {num_faces} Faces Detected!"
            color = (0, 0, 255)
            alert = True
            if SAVE_SCREENSHOTS:
                save_screenshot(image, "Multiple_Faces")
        else:
            face_missing_start = None
            face_landmarks = results.multi_face_landmarks[0]

            left_eye = face_landmarks.landmark[33]
            right_eye = face_landmarks.landmark[263]
            nose_tip = face_landmarks.landmark[1]
            left_cheek = face_landmarks.landmark[234]
            right_cheek = face_landmarks.landmark[454]

            x_left = int(left_eye.x * w)
            y_left = int(left_eye.y * h)
            x_right = int(right_eye.x * w)
            y_right = int(right_eye.y * h)
            x_nose = int(nose_tip.x * w)
            y_nose = int(nose_tip.y * h)
            x_left_cheek = int(left_cheek.x * w)
            x_right_cheek = int(right_cheek.x * w)

            direction = "Looking Forward"

            # Compare with baseline
            if baseline_nose_x is not None and baseline_nose_y is not None:
                # Side turn
                if abs(x_nose - baseline_nose_x) > w * 0.08:
                    direction = "Head Turned Sideways"
                    color = (0, 0, 255)
                    if not look_away_start:
                        look_away_start = now
                    elif now - look_away_start >= ALERT_LOOK_AWAY_SECS:
                        status = "⚠ Looking Away Too Long"
                        alert = True
                else:
                    look_away_start = None

                # Up/down
                if y_nose < baseline_nose_y - 15:
                    direction += " + Looking Up"
                elif y_nose > baseline_nose_y + 15:
                    direction += " + Looking Down"

            # Tilt detection
            angle = calculate_angle((x_left, y_left), (x_right, y_right))
            if angle > 25:
                direction += " + Tilt Left (Strong)"
            elif angle > 10:
                direction += " + Tilt Left (Medium)"
            elif angle < -25:
                direction += " + Tilt Right (Strong)"
            elif angle < -10:
                direction += " + Tilt Right (Medium)"

            if not status:
                status = direction

            mp_drawing.draw_landmarks(
                image=image,
                landmark_list=face_landmarks,
                connections=mp_face_mesh.FACEMESH_TESSELATION,
                landmark_drawing_spec=drawing_spec,
                connection_drawing_spec=drawing_spec
            )

            # Draw baseline button
            draw_button(image, "📌 Set Baseline")

    else:
        direction = "⚠ No Face Detected"
        color = (0, 0, 255)
        if not face_missing_start:
            face_missing_start = now
        elif now - face_missing_start >= ALERT_NO_FACE_SECS:
            status = "🚨 Face Missing Too Long"
            alert = True
        else:
            status = direction
        look_away_start = None

    if alert and SAVE_SCREENSHOTS:
        save_screenshot(image, reason=status.replace(" ", "_"))

    # Show status text
    cv2.putText(image, status, (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)

    # Show image
    cv2.imshow('Proctoring', image)

    # Handle mouse click
    def click_event(event, x, y, flags, param):
        global baseline_nose_x, baseline_nose_y
        if event == cv2.EVENT_LBUTTONDOWN:
            if BUTTON_X1 <= x <= BUTTON_X2 and BUTTON_Y1 <= y <= BUTTON_Y2:
                if results.multi_face_landmarks:
                    nose_tip = results.multi_face_landmarks[0].landmark[1]
                    baseline_nose_x = int(nose_tip.x * w)
                    baseline_nose_y = int(nose_tip.y * h)
                    print(f"📌 Baseline set at x={baseline_nose_x}, y={baseline_nose_y}")

    cv2.setMouseCallback('Proctoring', click_event)

    key = cv2.waitKey(5)
    if key == 27:
        break

cap.release()
cv2.destroyAllWindows()