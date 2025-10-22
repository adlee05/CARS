import * as ort from "onnxruntime-node";
import { AutoTokenizer } from "@huggingface/transformers";
import path from "path";

interface TensorDict {
  [name: string]: ort.Tensor;
}

class InferenceModel {
  private session!: ort.InferenceSession;

  constructor(private modelPath: string) {}

  async loadModel() {
    this.session = await ort.InferenceSession.create(this.modelPath);
  }

  async infer(feeds: TensorDict): Promise<ort.Tensor> {
    const results = await this.session.run(feeds);
    return results.output;
  }
}

class InferenceService {
  private newsEncoder: InferenceModel;
  private embeddingGemma: InferenceModel;
  private userEncoder: InferenceModel;
  private tokenizer!: AutoTokenizer;

  constructor() {
    const newsEncoderPath = path.join("src/models/news_encoder.onnx");
    const embeddingGemmaPath = path.join("src/models/model.onnx");
    const userEncoderPath = path.join("src/models/user_encoder.onnx");

    this.newsEncoder = new InferenceModel(newsEncoderPath);
    this.embeddingGemma = new InferenceModel(embeddingGemmaPath);
    this.userEncoder = new InferenceModel(userEncoderPath);
  }

  async initialize() {
    await Promise.all([
      this.newsEncoder.loadModel(),
      this.embeddingGemma.loadModel(),
      this.userEncoder.loadModel(),
    ]);

    this.tokenizer = await AutoTokenizer.from_pretrained(
      "onnx-community/embeddinggemma-300m-ONNX",
    );
  }
  //
  // async inferEmbedding(text: string): Promise<ort.Tensor> {
  //   console.log("Tokenizer loaded:", this.tokenizer);
  //
  //   // Encode the text - pass the text as parameter
  //   const encoded = await this.tokenizer(text);
  //
  //   console.log("Encoded output:", encoded);
  //
  //   // Extract input_ids from the encoded output
  //   const inputIds = encoded.input_ids;
  //
  //   // Convert to the format needed for ONNX
  //   // inputIds is typically a tensor or array-like object
  //   const inputIdsArray = Array.isArray(inputIds)
  //     ? inputIds
  //     : Array.from(inputIds.data);
  //
  //   const feeds: TensorDict = {
  //     input_ids: new ort.Tensor(
  //       "int64",
  //       BigInt64Array.from(inputIdsArray.map((x: number) => BigInt(x))),
  //       [1, inputIdsArray.length]
  //     )
  //   };
  //
  //   // Add attention_mask if your model needs it
  //   if (encoded.attention_mask) {
  //     const attentionMaskArray = Array.isArray(encoded.attention_mask)
  //       ? encoded.attention_mask
  //       : Array.from(encoded.attention_mask.data);
  //
  //     feeds["attention_mask"] = new ort.Tensor(
  //       "int64",
  //       BigInt64Array.from(attentionMaskArray.map((x: number) => BigInt(x))),
  //       [1, attentionMaskArray.length]
  //     );
  //   }
  //
  //   return this.embeddingGemma.infer(feeds);
  // }
  //
  async inferNews(input: Float32Array): Promise<ort.Tensor> {
    return this.newsEncoder.infer(input);
  }

  async inferUser(input: Float32Array): Promise<ort.Tensor> {
    return this.userEncoder.infer(input);
  }
}

export default InferenceService;
