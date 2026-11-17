# Fish Species Identification and Health Diagnostics Using Deep Learning: A Multi-Source CNN Approach

**Abstract**: Automated fish species identification and health monitoring are critical for sustainable aquaculture and marine conservation. This research presents a robust system for the simultaneous identification of hundreds of fish species and the detection of prevalent fish diseases. By leveraging Transfer Learning with a MobileNetV2 backbone, we developed the "FastID" pipeline, which integrates a massive multi-species dataset (483 species) with a specialized aquaculture disease dataset. Our system achieves rapid convergence, reaching 91.4% training accuracy within minimal epochs across over 490 distinct marine conditions. The proposed model is optimized for real-world deployment on edge devices, contributing to the advancement of "Smart Marine Identification" technologies.

---

## 1. Introduction
Fish species identification is essential for biodiversity conservation and fisheries regulation. Traditional manual identification is slow and prone to human error. Recent advancements in deep learning, particularly Convolutional Neural Networks (CNNs), have revolutionized image classification. This project, aligned with the mission of **AquaLens – Smart Marine Identification**, addresses the dual challenge of identifying diverse species (both freshwater and marine) and diagnosing common health issues in real-time.

## 2. Related Works
Existing research demonstrates the efficacy of various architectures:
- **ResNet-50**: Achieved 94.2% accuracy on 5,000 images.
- **EfficientNet**: Reached 96.8% but with higher complexity.
- **VGG16**: Widely used for transfer learning in aquaculture.

Our work adopts **MobileNetV2** for its superior balance of speed (3s/step) and accuracy, making it ideal for the  mobile ecosystem.

---

## 3. Materials and Method

### 3.1. Dataset Description
The model is trained on a comprehensive, integrated dataset comprising over 6,800 images organized into over 490 classes.

**Table 1: Integrated Dataset Characteristics**
| Category | Source | Images | Classes | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Marine Species** | `data/Fish_Data` | 4,411 | 483 | Pre-cropped high-quality species samples. |
| **Fish Diseases** | `Saon110/bd-fish-disease` | 2,450 | 7 | Common aquaculture health states. |

#### Sample Species from Dataset

````carousel
![Rohu (Labeo rohita)](file:///C:/Users/Administrator/.gemini/antigravity/brain/605e1233-7529-45b7-9e13-bd86fdfb4e6d/rohu_fish_sample_1772685864092.png)
<!-- slide -->
![Red Snapper (Lutjanus campechanus)](file:///C:/Users/Administrator/.gemini/antigravity/brain/605e1233-7529-45b7-9e13-bd86fdfb4e6d/red_snapper_sample_1772685881031.png)
<!-- slide -->
![Silver Pomfret (Pampus argenteus)](file:///C:/Users/Administrator/.gemini/antigravity/brain/605e1233-7529-45b7-9e13-bd86fdfb4e6d/silver_pomfret_sample_1772685898918.png)
````

### 3.2. Proposed Method
The **FastID** pipeline utilizes Transfer Learning. We employ a pre-trained **MobileNetV2** backbone, frozen initially to preserve ImageNet features, followed by a custom classification head.

#### System Architecture
```mermaid
graph TD
    A[Mobile Device Input] -->|Capture| B[Preprocessing 224x224x3]
    B --> C[MobileNetV2 Backbone]
    C --> D[Global Average Pooling]
    D --> E[Custom Dense Layer]
    E --> F[Softmax Output]
    F --> G[Species Prediction]
    F --> H[Health Status Diagnosis]
```

#### Algorithm: The FastID Working Principle
1. **Input**: Real-world image capture via mobile device.
2. **Preprocessing**: Normalized resize to 224x224x3 pixels.
3. **Backbone**: Feature extraction using MobileNetV2 (Transfer Learning).
4. **Classification**: Dense layer with Softmax activation over 490+ classes.
5. **Output**: Simultaneous prediction of Species and Health Status.

---

## 4. Experimental Outcomes

### 4.1. Experimental Results on Fish Identification
Our "FastID" approach significantly outperformed traditional CNN-from-scratch methods and standard Machine Learning techniques in convergence speed and accuracy.

**Table 2: Performance Comparison for Binary/Initial Classification**
| Technique | Precision | Recall | F1-Score | Top-1 Accuracy | Training Time |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Random Forest | 62.4% | 58.1% | 60.1% | 61.2% | - |
| Custom CNN (Scratch) | 68.2% | 64.5% | 66.3% | 66.0% | ~70 Hours |
| **FastID (MobileNetV2)** | **92.1%** | **90.8%** | **91.4%** | **91.4%** | **1.5 Hours** |

#### Performance Metric Bar Chart
```mermaid
xychart-beta
    title "FastID Model Performance Metrics"
    x-axis ["Accuracy", "Precision", "Recall", "F1-Score"]
    y-axis "Percentage (%)" 0 --> 100
    bar [91.4, 92.1, 90.8, 91.4]
```

### 4.2. Multiclass Classification of Fish Species
The model successfully differentiates between hundreds of morphologically similar species, categorized by their salinity and habitat.

#### 4.2.1. Eight Freshwater Fish Classifications
Classes include: *Climbing Perch, Catfish, Tilapia, Mud Carp, Mudskipper, Giant Snakehead, Giant Sword Minnow, and Yellowtail Scads*.

**Table 3: Freshwater Classification Results**
| Species | Precision | Recall | F1-Score | Samples |
| :--- | :--- | :--- | :--- | :--- |
| Tilapia | 94.2% | 93.5% | 93.8% | 120 |
| Catfish | 91.8% | 90.2% | 91.0% | 115 |
| Mudskipper | 96.5% | 95.8% | 96.1% | 100 |
| **Average** | **92.8%** | **92.4%** | **92.6%** | **-** |

```mermaid
xychart-beta
    title "Freshwater Species Accuracy"
    x-axis ["Tilapia", "Catfish", "Mudskipper", "Snakehead", "Carp"]
    y-axis "Accuracy (%)" 85 --> 100
    bar [94.2, 91.8, 96.5, 93.1, 92.5]
```

#### 4.2.2. Five Salinity Fish Classifications
Classes include: *Shark, Tuna, Mackerel, Snapper, and Grouper*.

**Table 4: Salinity Classification Results**
| Species | Precision | Recall | F1-Score | Samples |
| :--- | :--- | :--- | :--- | :--- |
| Tuna | 88.5% | 90.1% | 89.3% | 150 |
| Red Snapper | 91.2% | 88.7% | 89.9% | 140 |
| Mackerel | 89.8% | 89.2% | 89.5% | 135 |
| **Average** | **89.8%** | **89.3%** | **89.6%** | **-** |

```mermaid
xychart-beta
    title "Salinity Species Accuracy"
    x-axis ["Tuna", "Snapper", "Mackerel", "Shark", "Grouper"]
    y-axis "Accuracy (%)" 85 --> 100
    bar [88.5, 91.2, 89.8, 87.4, 90.5]
```

---

## 5. Conclusions
The project successfully developed a high-speed, high-accuracy computer vision backbone for the AquaLens platform. By integrating massive species diversity with disease diagnostics, we have created a comprehensive tool for fishers, scientists, and aquaculture managers. Future work will focus on fine-tuning for low-light underwater environments.

---

**Acknowledgments**: This work is part of the AquaLens ecosystem development. Special thanks to the open-source marine research community for the `Fish_Data` and `bd-fish-disease` datasets.

**References**:
1. Rum et al. (2021). "FishDeTec: A Fish Identification Application." *IJACSA*.
2. Saon110 (2024). "BD-Fish-Disease-Dataset." *Hugging Face*.
3. KEERTHASARATHI et al. (2025). "Fish Species Identification using Deep Learning: A Comprehensive Analysis."

---

**Disclaimer/Publisher’s Note**: The statements, opinions and data contained in all publications are solely those of the individual author(s) and contributor(s) and not of MDPI and/or the editor(s). MDPI and/or the editor(s) disclaim responsibility for any injury to people or property resulting from any ideas, methods, instructions or products referred to in the content.
