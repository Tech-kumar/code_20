const { Configuration, OpenAIApi } = require("openai");

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

async function chatbotResponse(query) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Provide insights for the query: ${query}`,
    max_tokens: 100,
  });
  return response.data.choices[0].text.trim();
}

module.exports = { chatbotResponse };
