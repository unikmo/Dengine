import crypto from 'node:crypto'

function key() {
  // A dedicated key is preferred. ANTHROPIC_API_KEY is already server-only and required
  // for generation, so it is a safe bootstrap key source for short-lived encrypted drafts.
  const secret = process.env.PLAN_ENCRYPTION_KEY || process.env.ANTHROPIC_API_KEY
  if (!secret || secret.length < 24) throw new Error('A strong server-side plan encryption secret is not configured.')
  return crypto.createHash('sha256').update(`dengine-plan-vault-v1:${secret}`).digest()
}

export function encryptPlan(value: unknown) {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', key(), iv)
  const plaintext = Buffer.from(JSON.stringify(value), 'utf8')
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()])
  const tag = cipher.getAuthTag()
  return {
    ciphertext: ciphertext.toString('base64'),
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
  }
}

export function decryptPlan(payload: { plan_ciphertext: string; plan_iv: string; plan_tag: string }) {
  const decipher = crypto.createDecipheriv('aes-256-gcm', key(), Buffer.from(payload.plan_iv, 'base64'))
  decipher.setAuthTag(Buffer.from(payload.plan_tag, 'base64'))
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(payload.plan_ciphertext, 'base64')),
    decipher.final(),
  ])
  return JSON.parse(plaintext.toString('utf8'))
}
