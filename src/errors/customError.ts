type Props = {
    name: string;
    message: string;
  };
  export default class CustomError {
    static createError({ name = "Error", message }: Props) {
      const error = new Error(message);
      error.name = name;
      throw error;
    }
  }