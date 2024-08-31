import { registerAs } from '@nestjs/config'

export default registerAs('config.main', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  frontedPort: parseInt(process.env.FRONTED_PORT, 10) || 4000
}))
