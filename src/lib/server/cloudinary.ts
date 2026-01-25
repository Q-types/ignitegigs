import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from '$env/static/private';
import { PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';

// Configure Cloudinary
cloudinary.config({
	cloud_name: PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET,
	secure: true
});

export interface UploadResult {
	public_id: string;
	secure_url: string;
	thumbnail_url: string;
	duration?: number;
	width: number;
	height: number;
	format: string;
	resource_type: string;
}

/**
 * Generate a signed upload signature for client-side uploads
 */
export function generateUploadSignature(folder: string = 'performers') {
	const timestamp = Math.round(new Date().getTime() / 1000);

	const params = {
		timestamp,
		folder,
		upload_preset: 'ignitegigs_videos',
		transformation: 'c_limit,w_1280,h_720,q_auto:good'
	};

	const signature = cloudinary.utils.api_sign_request(params, CLOUDINARY_API_SECRET);

	return {
		signature,
		timestamp,
		api_key: CLOUDINARY_API_KEY,
		cloud_name: PUBLIC_CLOUDINARY_CLOUD_NAME,
		folder
	};
}

/**
 * Upload a video file from server-side
 */
export async function uploadVideo(
	file: File,
	performerId: string
): Promise<UploadResult> {
	const buffer = Buffer.from(await file.arrayBuffer());

	return new Promise((resolve, reject) => {
		cloudinary.uploader
			.upload_stream(
				{
					resource_type: 'video',
					folder: `performers/${performerId}`,
					transformation: [
						{ width: 1280, height: 720, crop: 'limit' },
						{ quality: 'auto:good' }
					],
					eager: [
						// Generate thumbnail
						{ width: 400, height: 225, crop: 'fill', format: 'jpg' }
					],
					eager_async: false
				},
				(error, result) => {
					if (error) {
						reject(error);
						return;
					}
					if (!result) {
						reject(new Error('No result from Cloudinary'));
						return;
					}

					resolve({
						public_id: result.public_id,
						secure_url: result.secure_url,
						thumbnail_url: result.eager?.[0]?.secure_url || result.secure_url.replace(/\.[^.]+$/, '.jpg'),
						duration: result.duration,
						width: result.width,
						height: result.height,
						format: result.format,
						resource_type: result.resource_type
					});
				}
			)
			.end(buffer);
	});
}

/**
 * Upload a photo
 */
export async function uploadPhoto(
	file: File,
	performerId: string
): Promise<UploadResult> {
	const buffer = Buffer.from(await file.arrayBuffer());

	return new Promise((resolve, reject) => {
		cloudinary.uploader
			.upload_stream(
				{
					resource_type: 'image',
					folder: `performers/${performerId}/photos`,
					transformation: [
						{ width: 1200, height: 1200, crop: 'limit' },
						{ quality: 'auto:good' },
						{ fetch_format: 'auto' }
					],
					eager: [
						// Generate thumbnail
						{ width: 300, height: 300, crop: 'fill' }
					]
				},
				(error, result) => {
					if (error) {
						reject(error);
						return;
					}
					if (!result) {
						reject(new Error('No result from Cloudinary'));
						return;
					}

					resolve({
						public_id: result.public_id,
						secure_url: result.secure_url,
						thumbnail_url: result.eager?.[0]?.secure_url || result.secure_url,
						width: result.width,
						height: result.height,
						format: result.format,
						resource_type: result.resource_type
					});
				}
			)
			.end(buffer);
	});
}

/**
 * Delete a media file
 */
export async function deleteMedia(publicId: string, resourceType: 'video' | 'image' = 'video') {
	return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

/**
 * Generate a video thumbnail URL at specific time
 */
export function getVideoThumbnail(publicId: string, options?: { time?: number; width?: number; height?: number }) {
	const { time = 0, width = 400, height = 225 } = options || {};

	return cloudinary.url(publicId, {
		resource_type: 'video',
		format: 'jpg',
		transformation: [
			{ start_offset: time },
			{ width, height, crop: 'fill' }
		]
	});
}

/**
 * Generate optimized video URL for playback
 */
export function getOptimizedVideoUrl(publicId: string, options?: { quality?: string; format?: string }) {
	const { quality = 'auto', format = 'auto' } = options || {};

	return cloudinary.url(publicId, {
		resource_type: 'video',
		transformation: [
			{ quality },
			{ fetch_format: format }
		]
	});
}

export { cloudinary };
