var { AutoTokenizer, AutoModel } = require("@huggingface/transformers");

const main = async () => {
  let model_name = "onnx-community/embeddinggemma-300m-ONNX";
  let tokenizer = await AutoTokenizer.from_pretrained(model_name);
  let model = await AutoModel.from_pretrained(model_name);
  let inputs = await tokenizer([
    "I love transformers!",
    "I hate transformers!",
  ]);
  let output = await model(inputs);
  console.log(output.sentence_embedding);
};
main();
// .then(async (tokenizer) => {
//   var text = "This is an example input for embeddingGemma model.";
//   var inputIds = tokenizer(text);
//   var n_news = 1;
//   var maxLength = 512;
//   inputIds = inputIds.slice(0, maxLength);
//   var mask = new Array(inputIds.length).fill(1);
//   var inputs = {
//     input_ids: inputIds,
//     attention_mask: mask,
//   };
//   console.log(inputs);
//   const model = await AutoModel.from_pretrained(
//     "onnx-community/embeddinggemma-300m-ONNX",
//   );
//   const output = await model(inputs);
//   console.log(output);
//
//   //   model(inputs)
//   //     .then(function (results) {
//   //       console.log("Inference Results: ", results);
//   //     })
//   //     .catch(function (error) {
//   //       console.error("Error during inference: ", error);
//   //     });
//   // })
//   //
// })
// .catch(function (error) {
//   console.error("Error loading tokenizer: ", error);
// });
