import OpenAI from "openai";

const openai = new OpenAI();

export async function generateQueryEmbedding(
  query: string,
): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
    dimensions: 1536,
  });

  return response.data[0]!.embedding;
}
