import bcrypt from 'bcrypt'

export async function encryptPassword (password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  const saltedPassword = await bcrypt.hash(password, salt)
  return saltedPassword
}

export async function comparePassword (password: string, saltedPassword: string): Promise<boolean> {
  const isValid = await bcrypt.compare(password, saltedPassword)
  return isValid
}
