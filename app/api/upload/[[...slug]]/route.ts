import { Server } from '@tus/server';
import { FileStore } from '@tus/file-store';
import { NextRequest } from 'next/server';
import { db } from '@/server/db/db';
import { imageUploads } from '@/server/db/schema';
import fs from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = './files';

const server = new Server({
	// `path` needs to match the route declared by the next file router
	// ie /api/upload
	path: '/api/upload',
	datastore: new FileStore({ directory: UPLOAD_DIR }),
});

// Handle upload completion to save to DB
server.on('POST_FINISH', async (req, res, upload) => {
  try {
    // In a real app, you might want to store the file path or move it to S3
    // For now, let's read it as base64 to match the existing schema.
    
    const metadata = upload.metadata || {};
    const filePath = path.join(UPLOAD_DIR, upload.id);
    
    // Wait a bit to ensure the file is fully flushed if necessary, 
    // though POST_FINISH should mean it's done.
    const fileData = await fs.readFile(filePath);
    const base64 = fileData.toString('base64');

    await db.insert(imageUploads).values({
      name: metadata.filename || 'uploaded-file',
      type: metadata.filetype || 'image/png',
      size: Number(upload.size || 0),
      data: base64,
    });
    
    // Optionally delete the file from disk after saving to DB to save space
    await fs.unlink(filePath);
  } catch (err) {
    console.error('Error saving upload to DB:', err);
  }
});

export const GET = async (req: NextRequest) => server.handleWeb(req);
export const PATCH = async (req: NextRequest) => server.handleWeb(req);
export const POST = async (req: NextRequest) => server.handleWeb(req);
export const DELETE = async (req: NextRequest) => server.handleWeb(req);
export const OPTIONS = async (req: NextRequest) => server.handleWeb(req);
export const HEAD = async (req: NextRequest) => server.handleWeb(req);