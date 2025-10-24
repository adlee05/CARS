
var { AutoTokenizer, AutoModel } = require("@huggingface/transformers");

// Initialize tokenizer
AutoTokenizer.from_pretrained("onnx-community/embeddinggemma-300m-ONNX").then(function(tokenizer) {
  // Example text input
  var text = "This is an example input for embeddingGemma model.";

  // Tokenize the input text (synchronous method)
  var inputIds = tokenizer.encode(text);
  var n_news = 1; // For single input
  var maxLength = 512; // Max length for tokenization (can be adjusted)

  // Ensure tokenized input length does not exceed max length
  inputIds = inputIds.slice(0, maxLength);

  // Create attention mask
  var mask = new Array(inputIds.length).fill(1);

  // Prepare input tensor for Hugging Face model
  var inputs = {
    input_ids: inputIds,
    attention_mask: mask,
  };

  // Load the model
  AutoModel.from_pretrained("onnx-community/embeddinggemma-300m-ONNX").then(function(model) {
    // Run inference
    model(inputs).then(function(results) {
      // Log the results
      console.log("Inference Results: ", results);
    }).catch(function(error) {
      console.error("Error during inference: ", error);
    });
  }).catch(function(error) {
    console.error("Error loading model: ", error);
  });
}).catch(function(error) {
  console.error("Error loading tokenizer: ", error);
});

