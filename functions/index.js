const functions = require("firebase-functions");
const admin = require("firebase-admin");
const chatbot = require("./chatbot");

admin.initializeApp();
const db = admin.firestore();

exports.chatbot = functions.https.onRequest(async (req, res) => {
  const { query } = req.body;
  const response = await chatbot.chatbotResponse(query);
  res.send({ response });
});

exports.db = db;
