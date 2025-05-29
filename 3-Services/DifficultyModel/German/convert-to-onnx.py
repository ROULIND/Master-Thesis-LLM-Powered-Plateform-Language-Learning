from transformers import AutoTokenizer, AutoModelForSequenceClassification
from transformers.onnx import export
from pathlib import Path
import torch

# Define model path and output ONNX path
model_name = "./germanDifficultyModel"  # Path to your model
onnx_path = Path("model.onnx")  # Output ONNX file

label2id = {
    "A1": 0,
    "A2": 1,
    "B1": 2,
    "B2": 3,
    "C1": 4,
    "C2": 5
}

id2label = {v: k for k, v in label2id.items()}

# Load model and tokenizer
model = AutoModelForSequenceClassification.from_pretrained(
    model_name,
    num_labels=6,
    id2label=id2label,
    label2id=label2id
)
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Create dummy inputs
dummy_input = tokenizer(
    "This is a test input for ONNX model.",
    return_tensors="pt",
    max_length=512,
    padding="max_length",
    truncation=True,
)

# Export the model to ONNX
torch.onnx.export(
    model,                                            # PyTorch model
    (dummy_input["input_ids"], dummy_input["attention_mask"]),  # Model input
    onnx_path,                                       # Output ONNX file
    export_params=True,                              # Store the trained parameters
    opset_version=11,                                # ONNX version
    input_names=["input_ids", "attention_mask"],     # Input names
    output_names=["logits"],                         # Output names
    dynamic_axes={                                   # Dynamic axes for variable input lengths
        "input_ids": {0: "batch_size", 1: "seq_len"},
        "attention_mask": {0: "batch_size", 1: "seq_len"},
        "logits": {0: "batch_size"}
    },
)

print(f"ONNX model successfully saved to: {onnx_path}")
