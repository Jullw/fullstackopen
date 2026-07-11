const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGO_URL;

mongoose
  .connect(url, { family: 4 })

  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minlength: 5,
    required: true,
    validate: {
      validator: async function (content) {
        const existingNote = await mongoose.model("Note").exists({
          content,
          // Ei lasketa nykyistä dokumenttia duplikaatiksi päivitettäessä
          _id: { $ne: this._id },
        });

        return !existingNote;
      },

      message: (props) => `Note with content "${props.value}" already exists`,
    },
  },
  important: Boolean,
});

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Note", noteSchema);
