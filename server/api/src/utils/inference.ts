import * as ort from "onnxruntime-node";
import path from "path";
import { AutoModel, AutoTokenizer } from "@huggingface/transformers";

interface EncoderInput {
  embeddings: readonly number[][];
  embeddingDims: readonly number[];
}

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
    const outputName = this.session.outputNames[0];
    return results[outputName];
  }
}

class InferenceService {
  private newsEncoder: InferenceModel;
  private userEncoder: InferenceModel;
  constructor() {
    const newsEncoderPath = path.join("src/models/news_encoder.onnx");
    const userEncoderPath = path.join("src/models/user_encoder.onnx");
    this.newsEncoder = new InferenceModel(newsEncoderPath);
    this.userEncoder = new InferenceModel(userEncoderPath);
  }
  async initialize() {
    await Promise.all([
      this.newsEncoder.loadModel(),
      this.userEncoder.loadModel(),
    ]);
  }
  async inferNews(input: EncoderInput): Promise<ort.Tensor> {
    const flattenedEmbeddings = new Float32Array(input.embeddings.flat());
    const embeddingTensor = new ort.Tensor("float32", flattenedEmbeddings, [
      1,
      ...input.embeddingDims,
    ]);
    const seqLen = input.embeddings.length;
    const mask = Uint8Array.from({ length: seqLen }, () => 1);
    const maskDims = [1, seqLen];
    const maskTensor = new ort.Tensor("bool", mask, maskDims);
    const feeds = {
      news_embeddings: embeddingTensor,
      mask: maskTensor,
    };
    return this.newsEncoder.infer(feeds);
  }
  async inferUser(input: EncoderInput): Promise<ort.Tensor> {
    const flattenedEmbeddings = new Float32Array(input.embeddings.flat());
    const embeddingTensor = new ort.Tensor("float32", flattenedEmbeddings, [
      1,
      ...input.embeddingDims,
    ]);
    const seqLen = input.embeddings.length;
    const mask = Uint8Array.from({ length: seqLen }, () => 1);
    const maskDims = [1, seqLen];
    const maskTensor = new ort.Tensor("bool", mask, maskDims);
    const feeds = {
      history: embeddingTensor,
      mask: maskTensor,
    };
    return this.userEncoder.infer(feeds);
  }
}

export default InferenceService;
