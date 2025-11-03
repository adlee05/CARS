import InferenceService from '../../utils/inference';
import * as ort from 'onnxruntime-node';

jest.mock('onnxruntime-node');
jest.mock('@huggingface/transformers', () => ({
  AutoModel: jest.fn(),
  AutoTokenizer: jest.fn(),
}));

describe('InferenceService', () => {
  let service: InferenceService;
  let mockSession: jest.Mocked<ort.InferenceSession>;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new InferenceService();
    
    mockSession = {
      run: jest.fn(),
      outputNames: ['output'],
    } as any;

    (ort.InferenceSession.create as jest.Mock).mockResolvedValue(mockSession);
  });

  describe('initialize', () => {
    it('should initialize both encoders', async () => {
      await service.initialize();

      expect(ort.InferenceSession.create).toHaveBeenCalledTimes(2);
    });
  });

  describe('inferNews', () => {
    it('should infer news embeddings', async () => {
      await service.initialize();
      
      const embeddings = [[0.1, 0.2, 0.3], [0.4, 0.5, 0.6]];
      const embeddingDims = [2, 768];
      const mockOutput = new ort.Tensor('float32', new Float32Array([0.5]), [1, 768]);

      mockSession.run.mockResolvedValue({ output: mockOutput });

      const result = await service.inferNews({
        embeddings,
        embeddingDims,
      });

      expect(mockSession.run).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('inferUser', () => {
    it('should infer user representation', async () => {
      await service.initialize();
      
      const embeddings = [[0.1, 0.2, 0.3], [0.4, 0.5, 0.6]];
      const embeddingDims = [2, 768];
      const mockOutput = new ort.Tensor('float32', new Float32Array([0.5]), [1, 768]);

      mockSession.run.mockResolvedValue({ output: mockOutput });

      const result = await service.inferUser({
        embeddings,
        embeddingDims,
      });

      expect(mockSession.run).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
});

