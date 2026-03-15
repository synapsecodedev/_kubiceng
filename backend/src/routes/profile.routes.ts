import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { supabase } from '../lib/supabase'

export async function profileRoutes(app: FastifyInstance) {
  // GET /profile - Fetch current user and company data
  app.get('/profile/:userId', async (request, reply) => {
    const { userId } = z.object({ userId: z.string().uuid() }).parse(request.params)
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        companyName: true,
        companyCnpj: true,
        companyAddress: true,
        companyLogoUrl: true,
      }
    })

    if (!user) {
      return reply.status(404).send({ message: 'Usuário não encontrado' })
    }

    return user
  })

  // PUT /profile/:userId - Update profile text data
  app.put('/profile/:userId', async (request) => {
    const { userId } = z.object({ userId: z.string().uuid() }).parse(request.params)
    const schema = z.object({
      name: z.string().min(3),
      avatarUrl: z.string().optional(),
    })
    
    const data = schema.parse(request.body)
    return prisma.user.update({
      where: { id: userId },
      data
    })
  })

  // PUT /profile/:userId/company - Update company text data
  app.put('/profile/:userId/company', async (request) => {
    const { userId } = z.object({ userId: z.string().uuid() }).parse(request.params)
    const schema = z.object({
      companyName: z.string(),
      companyCnpj: z.string(),
      companyAddress: z.string(),
      companyLogoUrl: z.string().optional(),
    })
    
    const data = schema.parse(request.body)
    return prisma.user.update({
      where: { id: userId },
      data
    })
  })

  // POST /profile/upload - Handle image upload to Supabase Storage
  app.post('/profile/upload', async (request, reply) => {
    const data = await (request as any).file()
    if (!data) {
      return reply.status(400).send({ message: 'Nenhum arquivo enviado' })
    }

    const { type, userId } = request.query as { type: 'avatar' | 'logo', userId: string }
    if (!userId) {
      return reply.status(400).send({ message: 'UserId não fornecido' })
    }

    const fileBuffer = await data.toBuffer()
    const fileName = `${userId}-${Date.now()}-${data.filename}`
    const bucket = type === 'avatar' ? 'avatars' : 'logos'

    const { data: _uploadData, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, fileBuffer, {
        contentType: data.mimetype,
        upsert: true
      })

    if (error) {
      console.error('Erro no upload Supabase:', error)
      return reply.status(500).send({ message: 'Erro ao fazer upload da imagem', error })
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)

    // Update user in DB
    const updateField = type === 'avatar' ? 'avatarUrl' : 'companyLogoUrl'
    await prisma.user.update({
      where: { id: userId },
      data: { [updateField]: publicUrl }
    })

    return { publicUrl }
  })
}

export default profileRoutes;
