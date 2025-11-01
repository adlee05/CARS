import bcrypt from "bcryptjs";
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // You can adjust the salt rounds (cost factor)
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

export { hashPassword };
