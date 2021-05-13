import { markAllSV } from "./../services/notifyService";

let markAllControler = async (req, res) => {
  try {
    let mark = await markAllSV(req.user._id, req.body.tagetUser);
    return res.status(200).send(mark);
    console.log(mark)

  } catch (error) {
    return res.status(500).send(error);

  }
}
module.exports = {
  markAllControler: markAllControler,
}