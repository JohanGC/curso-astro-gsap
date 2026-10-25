import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const proyectos = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/proyectos' }),
    schema: z.object({
        titulo: z.string(),
        fecha: z.coerce.date(),
        destacado: z.boolean().default(false),
    }),
});

export const collections = { proyectos };