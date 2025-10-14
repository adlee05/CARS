import express from "express";
import * as ort from "onnxruntime-node";
import path from "path";

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Load your ONNX model
const modelPath = path.join("news_encoder.onnx"); // Replace with your model's path

// Inference endpoint
app.post("/predict", async (req, res) => {
  try {
    // Ensure input data is provided
    const { input } = req.body;
    if (!input) {
      return res.status(400).json({ error: "Input data is required" });
    }

    // Prepare input tensor from the request data
    const tensor = new ort.Tensor("float32", new Float32Array(input), [
      1,
      input.length,
    ]); // Modify shape as per model's requirement

    // Run inference
    const session = await ort.InferenceSession.create(modelPath);
    const output = await session.run({ news_embeddings: tensor });

    // Send the result back
    res.json(output);
  } catch (error) {
    console.error("Error during inference:", error);
    res.status(500).json({ error: "Inference failed", details: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`ONNX inference server running at http://localhost:${port}`);
});
