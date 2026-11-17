import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import os
import json

# Define paths relative to this workspace or absolute
DATASET_DIR = r"D:\unnamed\dataset\train"
MODELS_DIR = os.path.join(os.getcwd(), 'models')

def build_innovative_cnn(input_shape=(224, 224, 3), num_classes=10):
    """
    Builds a fast transfer learning model using MobileNetV2.
    Optimized for speed and accuracy.
    """
    from tensorflow.keras import layers, models
    from tensorflow.keras.applications import MobileNetV2
    
    # Base model: MobileNetV2 pre-trained on ImageNet
    base_model = MobileNetV2(
        input_shape=input_shape,
        include_top=False,
        weights='imagenet'
    )

    # Freeze the base model to speed up initial training
    base_model.trainable = False

    inputs = layers.Input(shape=input_shape)
    
    # Preprocessing layer for MobileNetV2
    x = tf.keras.applications.mobilenet_v2.preprocess_input(inputs)
    
    x = base_model(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.2)(x)
    
    # Output Layer
    outputs = layers.Dense(num_classes, activation='softmax')(x)

    model = models.Model(inputs, outputs)
    return model

def train_model(dataset_path=DATASET_DIR, epochs=5): # Reduced epochs for verification
    """
    Trains the FastID model on the provided dataset.
    """
    if not os.path.exists(dataset_path):
        print(f"[ERROR] Dataset directory not found at: {dataset_path}")
        return

    # Create models directory if it doesn't exist
    if not os.path.exists(MODELS_DIR):
        os.makedirs(MODELS_DIR)

    # 1. Data Augmentation
    train_datagen = ImageDataGenerator(
        rotation_range=20,
        width_shift_range=0.1,
        height_shift_range=0.1,
        shear_range=0.1,
        zoom_range=0.1,
        horizontal_flip=True,
        fill_mode='nearest',
        validation_split=0.2
    )

    train_generator = train_datagen.flow_from_directory(
        dataset_path,
        target_size=(224, 224),
        batch_size=32,
        class_mode='categorical',
        subset='training'
    )

    validation_generator = train_datagen.flow_from_directory(
        dataset_path,
        target_size=(224, 224),
        batch_size=32,
        class_mode='categorical',
        subset='validation'
    )

    # Save class indices
    class_indices = train_generator.class_indices
    indices_path = os.path.join(MODELS_DIR, 'class_indices.json')
    with open(indices_path, 'w') as f:
        json.dump(class_indices, f)
    print(f"[INFO] Saved {len(class_indices)} class indices to {indices_path}")

    # 2. Build and Compile Model
    num_classes = train_generator.num_classes
    model = build_innovative_cnn(num_classes=num_classes)
    
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    # 3. Callbacks
    model_path = os.path.join(MODELS_DIR, 'fish_id_model_v1.keras')
    callbacks = [
        tf.keras.callbacks.EarlyStopping(monitor='val_accuracy', patience=3, restore_best_weights=True),
        tf.keras.callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=2),
        tf.keras.callbacks.ModelCheckpoint(model_path, save_best_only=True, monitor='val_accuracy')
    ]

    # 4. Training
    print(f"\n[FAST TRAINING START] on {len(class_indices)} classes")
    history = model.fit(
        train_generator,
        epochs=epochs,
        validation_data=validation_generator,
        callbacks=callbacks
    )

    # 5. Final Metrics
    if 'val_accuracy' in history.history:
        final_acc = max(history.history['val_accuracy'])
        print(f"\n[TRAINING COMPLETE] Best Validation Accuracy: {final_acc * 100:.2f}%")
    
    model.save(model_path)
    print(f"[INFO] Model saved as {model_path}")

if __name__ == "__main__":
    train_model()
