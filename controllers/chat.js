const Query = require("../models/Query");
const { createCompletionChatGTP } = require("../chatGTP");
const { v4: uuid } = require("uuid");

exports.chat = async (req, res) => {
  try {
    const tempId = uuid();
    await Query.updateOne(
      { _id: req.queryId },
      { $push: { texts: { message: req.body.message, textBy: 1 } } }
    );
    const data = await createCompletionChatGTP({
      message: req.body.message,
    });
    console.log("data = ", data)
    content = data.choices[0].message.content
    await Query.updateOne(
      { _id: req.queryId },
      {
        $push: {
          texts: { message: content, textBy: 0 },
        },
      }
    );    
    res.send({
      message: content,
      _id: data.choices[0] ? tempId : undefined,
    });
  } catch (err) {
    res.status(400).send({ success: false, message: err.message });
  }
};

exports.getAllChats = async (req, res) => {
  try {
    const query = await Query.findOne({ _id: req.queryId });
    if (!query)
      return res
        .status(400)
        .send({ success: false, message: "Query doesn't exist" });
    res.send(query);
  } catch (err) {
    res.status(400).send({ success: false, message: err.message });
  }
};
