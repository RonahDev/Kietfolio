import { Request, Response, NextFunction } from 'express'
import zlib from 'node:zlib'

/**
 * Enterprise Native HTTP Compression Middleware (Zero Third-Party Dependencies)
 * Automatically compresses response payloads (JSON, Text, HTML) using Gzip or Deflate
 * when accepted by client and payload size exceeds 512 bytes.
 */
export function compressionMiddleware(req: Request, res: Response, next: NextFunction): void {
  const acceptEncoding = (req.headers['accept-encoding'] || '') as string
  const supportsGzip = acceptEncoding.includes('gzip')
  const supportsDeflate = acceptEncoding.includes('deflate')

  if (!supportsGzip && !supportsDeflate) {
    return next()
  }

  // Intercept res.send
  const originalSend = res.send.bind(res)

  res.send = function (body: unknown): Response {
    if (res.headersSent) {
      return originalSend(body)
    }

    let buffer: Buffer | null = null

    if (Buffer.isBuffer(body)) {
      buffer = body
    } else if (typeof body === 'string') {
      buffer = Buffer.from(body, 'utf-8')
    } else if (body !== null && typeof body === 'object') {
      buffer = Buffer.from(JSON.stringify(body), 'utf-8')
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
    }

    // Only compress payloads larger than 512 bytes
    if (!buffer || buffer.length < 512) {
      return originalSend(body)
    }

    try {
      if (supportsGzip) {
        const compressed = zlib.gzipSync(buffer, { level: 6 })
        res.setHeader('Content-Encoding', 'gzip')
        res.setHeader('Vary', 'Accept-Encoding')
        res.removeHeader('Content-Length')
        return originalSend(compressed)
      } else if (supportsDeflate) {
        const compressed = zlib.deflateSync(buffer, { level: 6 })
        res.setHeader('Content-Encoding', 'deflate')
        res.setHeader('Vary', 'Accept-Encoding')
        res.removeHeader('Content-Length')
        return originalSend(compressed)
      }
    } catch {
      // In case of compression failure, seamlessly fallback to uncompressed payload
      return originalSend(buffer)
    }

    return originalSend(body)
  }

  next()
}
