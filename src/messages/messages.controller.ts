import { Request, Response } from "express";

//TODO endpoint not implemented on next
export const getChatPage = async (req: Request, res: Response) => {
  try {
    //As user is not logged for this view cant access to the object
    //The idea for this view is only show how to work with handlebars
    res.render("chat", {
      style: "style.css",
      user: { first_name: "Relena" },
    });
  } catch (error) {
    req.logger.error(error);

    res.send({
      succes: false,
      error,
    });
  }
};
