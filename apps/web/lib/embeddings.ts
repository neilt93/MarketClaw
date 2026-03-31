import OpenAI from "openai";

const openai = new OpenAI();

/** Generate embedding for listing text using OpenAI text-embedding-3-small */
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    dimensions: 1536,
  });

  return response.data[0]!.embedding;
}

/** Generate embedding for search query */
export async function generateQueryEmbedding(
  query: string,
): Promise<number[]> {
  return generateEmbedding(query);
}
